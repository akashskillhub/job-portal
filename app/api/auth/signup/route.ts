import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { companySignUpSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const validatedData = companySignUpSchema.parse(body);

    // Check if company already exists
    const existingCompany = await Company.findOne({ email: validatedData.email });
    if (existingCompany) {
      return apiError("Company with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create company
    const company = await Company.create({
      ...validatedData,
      password: hashedPassword,
      isApproved: false,
    });

    // Send welcome email
    EmailService.sendWelcomeEmail(
      company.email,
      company.name,
      "company"
    ).catch((err) => console.error("Welcome email error:", err));

    return apiResponse(
      {
        message: "Company registered successfully. Awaiting admin approval.",
        companyId: company._id,
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to register company", 500);
  }
}