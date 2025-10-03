import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { createCollegeSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const colleges = await College.find().select("-password").sort({ createdAt: -1 }).lean();

    return apiResponse({ colleges });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch colleges", 500);
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
    const validatedData = createCollegeSchema.parse(body);

    // Check if college already exists
    const existingCollege = await College.findOne({ email: validatedData.email });
    if (existingCollege) {
      return apiError("College with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create college
    const college = await College.create({
      ...validatedData,
      password: hashedPassword,
    });

    return apiResponse(
      {
        message: "College created successfully",
        college: {
          _id: college._id,
          name: college.name,
          email: college.email,
        },
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to create college", 500);
  }
}