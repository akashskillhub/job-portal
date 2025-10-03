import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { createStudentSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const students = await Student.find()
      .select("-password")
      .populate("collegeId", "name")
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

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const body = await req.json();
    const validatedData = createStudentSchema.parse(body);

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: validatedData.email });
    if (existingStudent) {
      return apiError("Student with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create student
    const student = await Student.create({
      ...validatedData,
      password: hashedPassword,
    });

    // Send welcome email
    EmailService.sendWelcomeEmail(
      student.email,
      `${student.firstName} ${student.lastName}`,
      "student"
    ).catch((err) => console.error("Welcome email error:", err));

    return apiResponse(
      {
        message: "Student created successfully",
        student: {
          _id: student._id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to create student", 500);
  }
}