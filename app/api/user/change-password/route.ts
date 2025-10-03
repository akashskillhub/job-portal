import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import College from "@/models/College";
import Company from "@/models/Company";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { apiError, apiResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return apiError("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return apiError("New password must be at least 6 characters", 400);
    }

    // Get user based on role
    let user = null;
    let Model = null;

    switch (session.user.role) {
      case "admin":
        Model = Admin;
        break;
      case "college":
        Model = College;
        break;
      case "company":
        Model = Company;
        break;
      case "student":
        Model = Student;
        break;
      default:
        return apiError("Invalid role", 400);
    }

    user = await Model.findById(session.user.id);

    if (!user) {
      return apiError("User not found", 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return apiError("Current password is incorrect", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await Model.findByIdAndUpdate(session.user.id, {
      password: hashedPassword,
    });

    return apiResponse({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Change password error:", error);
    return apiError(error.message || "Failed to change password", 500);
  }
}
