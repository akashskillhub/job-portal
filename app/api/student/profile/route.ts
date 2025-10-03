import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const student = await Student.findById(session.user.id)
      .select("-password")
      .populate("collegeId", "name")
      .lean();

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({ student });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch profile", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const body = await req.json();

    // Remove fields that shouldn't be updated
    delete body.email;
    delete body.password;
    delete body.collegeId;
    delete body.role;

    const student = await Student.findByIdAndUpdate(session.user.id, body, {
      new: true,
    })
      .select("-password")
      .populate("collegeId", "name");

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({
      message: "Profile updated successfully",
      student,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to update profile", 500);
  }
}