import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import EmailVerification from "@/models/EmailVerification";
import { apiError, apiResponse } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { token } = await req.json();

    if (!token) {
      return apiError("Verification token is required", 400);
    }

    // Find verification record
    const verification = await EmailVerification.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return apiError("Invalid or expired verification token", 400);
    }

    // Update student email verification status
    const student = await Student.findOneAndUpdate(
      { email: verification.email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!student) {
      return apiError("Student not found", 404);
    }

    // Delete verification record
    await EmailVerification.deleteOne({ _id: verification._id });

    return apiResponse({
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return apiError(error.message || "Failed to verify email", 500);
  }
}
