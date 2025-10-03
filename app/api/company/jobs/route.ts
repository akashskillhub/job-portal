import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";
import Student from "@/models/Student";
import { createJobSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const jobs = await Job.find({ companyId: session.user.id })
      .populate("allowedColleges", "name")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ jobs });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch jobs", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    // Check if company is approved
    const company = await Company.findById(session.user.id);
    if (!company?.isApproved) {
      return apiError("Your company is not yet approved by admin", 403);
    }

    const body = await req.json();
    const validatedData = createJobSchema.parse(body);

    // Create job
    const job = await Job.create({
      ...validatedData,
      companyId: session.user.id,
    });

    // Notify matching students based on stream, CGPA, and skills
    const matchingStudents = await Student.find({
      stream: { $in: validatedData.allowedStreams },
      cgpa: { $gte: validatedData.minCGPA },
      ...(validatedData.allowedColleges.length > 0 && {
        collegeId: { $in: validatedData.allowedColleges },
      }),
    }).select("email firstName lastName skills");

    // Calculate skill match percentage and filter students
    const jobSkills = validatedData.skills.map((s: string) => s.toLowerCase());
    const MIN_SKILL_MATCH = 0.4; // 40% minimum match

    const qualifiedStudents = matchingStudents.filter((student) => {
      if (!student.skills || student.skills.length === 0 || jobSkills.length === 0) {
        return true; // Include students with no skills (for backward compatibility)
      }

      const studentSkills = student.skills.map((s: string) => s.toLowerCase());
      const matchingSkillsCount = jobSkills.filter((skill: string) =>
        studentSkills.some((studentSkill: string) => studentSkill.includes(skill) || skill.includes(studentSkill))
      ).length;

      const matchPercentage = matchingSkillsCount / jobSkills.length;
      return matchPercentage >= MIN_SKILL_MATCH; // Only notify if 40%+ match
    });

    // Send notification emails to qualified students (in background)
    if (qualifiedStudents.length > 0) {
      qualifiedStudents.forEach((student) => {
        EmailService.sendJobPostedNotification(
          student.email,
          `${student.firstName} ${student.lastName}`,
          job.title,
          company.name,
          job.location
        ).catch((err) => console.error("Job notification email error:", err));
      });
    }

    return apiResponse(
      {
        message: "Job created successfully",
        job,
        notifiedStudents: qualifiedStudents.length,
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to create job", 500);
  }
}