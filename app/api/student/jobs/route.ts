import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import Student from "@/models/Student";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    // Get student details
    const student = await Student.findById(session.user.id);

    if (!student) {
      return apiError("Student not found", 404);
    }

    // Find jobs that match student's college and stream
    const jobs = await Job.find({
      isActive: true,
      applicationDeadline: { $gte: new Date() },
      $or: [
        { allowedColleges: { $size: 0 } }, // No college restriction
        { allowedColleges: student.collegeId },
      ],
      allowedStreams: student.stream,
      minCGPA: { $lte: student.cgpa },
    })
      .populate("companyId", "name industry city")
      .populate("allowedColleges", "name")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ jobs });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch jobs", 500);
  }
}