import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import College from "@/models/College";
import Company from "@/models/Company";
import Student from "@/models/Student";
import PasswordReset from "@/models/PasswordReset";
import { EmailService } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Find user based on role
    let user = null;
    let userName = "";

    switch (role) {
      case "admin":
        user = await Admin.findOne({ email });
        userName = user?.name || "Admin";
        break;
      case "college":
        user = await College.findOne({ email });
        userName = user?.name || "College";
        break;
      case "company":
        user = await Company.findOne({ email });
        userName = user?.name || "Company";
        break;
      case "student":
        user = await Student.findOne({ email });
        userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student";
        break;
      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If the email exists, a password reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Delete any existing reset tokens for this email
    await PasswordReset.deleteMany({ email, role });

    // Create new reset token
    await PasswordReset.create({
      email,
      token: resetToken,
      role,
      expiresAt: new Date(Date.now() + parseInt(process.env.JWT_RESET_TOKEN_EXPIRY || "600000")),
    });

    // Send password reset email
    await EmailService.sendPasswordResetEmail(email, userName, resetToken);

    return NextResponse.json(
      { message: "If the email exists, a password reset link has been sent" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
