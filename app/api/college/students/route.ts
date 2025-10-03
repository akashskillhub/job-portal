import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "college") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const students = await Student.find({ collegeId: session.user.id })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ students });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch students", 500);
  }
}