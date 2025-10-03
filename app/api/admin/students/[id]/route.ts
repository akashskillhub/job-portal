import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { apiError, apiResponse } from "@/lib/middleware";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { id } = await params;
    const student = await Student.findById(id).populate("collegeId", "name");

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({ student });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch student", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const { password, ...updateData } = body;

    // If password is provided, hash it
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("collegeId", "name");

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({ student, message: "Student updated successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to update student", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { id } = await params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return apiError("Student not found", 404);
    }

    return apiResponse({ message: "Student deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete student", 500);
  }
}