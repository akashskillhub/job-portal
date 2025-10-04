import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { apiError, apiResponse } from "@/lib/middleware";
import bcrypt from "bcryptjs";
import { EmailService } from "@/lib/email";

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "college") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      rollNumber,
      stream,
      graduationYear,
      cgpa,
      phone,
      skills,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !rollNumber || !stream || !graduationYear) {
      return apiError("All required fields must be provided", 400);
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return apiError("Student with this email already exists", 400);
    }

    // Check if roll number already exists in this college
    const existingRollNumber = await Student.findOne({
      collegeId: session.user.id,
      rollNumber,
    });
    if (existingRollNumber) {
      return apiError("Roll number already exists for this college", 400);
    }

    // Generate temporary password (first name + last 4 digits of roll number)
    const tempPassword = `${firstName.toLowerCase()}${rollNumber.slice(-4)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      collegeId: session.user.id,
      rollNumber,
      stream,
      graduationYear: parseInt(graduationYear),
      cgpa: cgpa ? parseFloat(cgpa) : undefined,
      phone,
      skills: skills || [],
      isEmailVerified: true, // Auto-verified when added by college
    });

    // Send welcome email with credentials
    await EmailService.sendWelcomeEmail(
      email,
      `${firstName} ${lastName}`,
      "Student"
    ).catch((err) => console.error("Welcome email error:", err));

    // Send additional email with login credentials
    const loginEmail = {
      subject: "Your College Job Portal Account Details",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #800000;">Your Account Has Been Created</h2>
          <p>Hello ${firstName} ${lastName},</p>
          <p>Your college has created an account for you on the College Job Portal.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #800000; margin: 20px 0;">
            <p><strong>Login Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Roll Number:</strong> ${rollNumber}</p>
          </div>
          <p style="color: #d9534f;"><strong>Important:</strong> Please change your password after your first login.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/auth/signin"
               style="background-color: #800000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Login Now
            </a>
          </p>
          <p>After logging in, you can:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Add skills and upload resume</li>
            <li>Browse and apply for jobs</li>
            <li>Track your applications</li>
          </ul>
          <br/>
          <p>Best regards,<br/>College Job Portal Team</p>
        </div>
      `,
    };

    await EmailService.sendWelcomeEmail(email, `${firstName} ${lastName}`, "Student");
    // Send custom login credentials email
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_PASS,
      },
    });

    await transporter.sendMail({
      from: `College Job Portal <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: loginEmail.subject,
      html: loginEmail.html,
    }).catch((err: any) => console.error("Login email error:", err));

    return apiResponse(
      {
        message: "Student added successfully. Login credentials sent to email.",
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          rollNumber: student.rollNumber,
        },
      },
      201
    );
  } catch (error: any) {
    console.error("Add student error:", error);
    return apiError(error.message || "Failed to add student", 500);
  }
}