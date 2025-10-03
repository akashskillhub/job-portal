import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import EmailVerification from "@/models/EmailVerification";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { firstName, lastName, email, password, collegeId, rollNumber, stream, graduationYear, cgpa, phone, skills } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !collegeId || !rollNumber || !stream) {
      return apiError("All required fields must be provided", 400);
    }

    if (password.length < 6) {
      return apiError("Password must be at least 6 characters", 400);
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return apiError("Student with this email already exists", 400);
    }

    // Check for duplicate roll number in same college
    const existingRollNumber = await Student.findOne({ collegeId, rollNumber });
    if (existingRollNumber) {
      return apiError("Roll number already exists for this college", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student (not verified yet)
    const student = await Student.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      collegeId,
      rollNumber,
      stream,
      graduationYear,
      cgpa: parseFloat(cgpa),
      phone,
      skills: skills || [],
      isEmailVerified: false,
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await EmailVerification.create({
      email: email.toLowerCase(),
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

    await EmailService.sendEmailVerification(
      email,
      `${firstName} ${lastName}`,
      verificationUrl
    ).catch((err) => console.error("Verification email error:", err));

    return apiResponse(
      {
        message: "Registration successful! Please check your email to verify your account.",
        studentId: student._id,
      },
      201
    );
  } catch (error: any) {
    console.error("Student signup error:", error);
    return apiError(error.message || "Failed to register student", 500);
  }
}
