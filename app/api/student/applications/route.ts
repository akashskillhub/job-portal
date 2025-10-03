import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import Student from "@/models/Student";
import { createApplicationSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const applications = await Application.find({ studentId: session.user.id })
      .populate({
        path: "jobId",
        populate: {
          path: "companyId",
          select: "name industry",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ applications });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch applications", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const body = await req.json();
    const validatedData = createApplicationSchema.parse(body);

    // Get student details
    const student = await Student.findById(session.user.id);

    if (!student) {
      return apiError("Student not found", 404);
    }

    // Get job details
    const job = await Job.findById(validatedData.jobId);

    if (!job) {
      return apiError("Job not found", 404);
    }

    // Check if job is active and deadline hasn't passed
    if (!job.isActive) {
      return apiError("This job is no longer active", 400);
    }

    if (new Date(job.applicationDeadline) < new Date()) {
      return apiError("Application deadline has passed", 400);
    }

    // Check if student meets requirements
    if (student.cgpa < job.minCGPA) {
      return apiError("You do not meet the minimum CGPA requirement", 400);
    }

    if (!job.allowedStreams.includes(student.stream)) {
      return apiError("Your stream is not eligible for this job", 400);
    }

    // Check college eligibility if specified
    if (
      job.allowedColleges.length > 0 &&
      !job.allowedColleges.some((id) => id.toString() === student.collegeId.toString())
    ) {
      return apiError("Your college is not eligible for this job", 400);
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId: validatedData.jobId,
      studentId: session.user.id,
    });

    if (existingApplication) {
      return apiError("You have already applied for this job", 400);
    }

    // Create application
    const application = await Application.create({
      jobId: validatedData.jobId,
      studentId: session.user.id,
      coverLetter: validatedData.coverLetter,
    });

    // Send email notification to company
    const Company = (await import("@/models/Company")).default;
    const company = await Company.findById(job.companyId);

    if (company) {
      const studentName = `${student.firstName} ${student.lastName}`;
      const companyName = company.name;
      const jobTitle = job.title;

      // Send email in background (don't wait for it)
      EmailService.sendNewApplicationNotification(
        company.email,
        companyName,
        studentName,
        jobTitle
      ).catch((err) => console.error("Email send error:", err));
    }

    return apiResponse(
      {
        message: "Application submitted successfully",
        application,
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to submit application", 500);
  }
}