import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import College from "@/models/College";
import Company from "@/models/Company";
import Student from "@/models/Student";
import PasswordReset from "@/models/PasswordReset";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password based on role
    let updated = false;
    switch (resetRecord.role) {
      case "admin":
        await Admin.updateOne(
          { email: resetRecord.email },
          { password: hashedPassword }
        );
        updated = true;
        break;
      case "college":
        await College.updateOne(
          { email: resetRecord.email },
          { password: hashedPassword }
        );
        updated = true;
        break;
      case "company":
        await Company.updateOne(
          { email: resetRecord.email },
          { password: hashedPassword }
        );
        updated = true;
        break;
      case "student":
        await Student.updateOne(
          { email: resetRecord.email },
          { password: hashedPassword }
        );
        updated = true;
        break;
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Delete used reset token
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
