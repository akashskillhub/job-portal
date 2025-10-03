import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { saveResume } from "@/lib/file-upload";
import { apiError, apiResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return apiError("No file provided", 400);
    }

    // Save the resume
    const resumeUrl = await saveResume(file, session.user.id);

    // Update student record
    const student = await Student.findByIdAndUpdate(
      session.user.id,
      { resumeUrl },
      { new: true }
    ).select("-password");

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({
      message: "Resume uploaded successfully",
      resumeUrl,
      student,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to upload resume", 500);
  }
}