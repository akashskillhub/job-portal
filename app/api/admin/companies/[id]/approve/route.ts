import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { apiError, apiResponse } from "@/lib/middleware";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const company = await Company.findByIdAndUpdate(
      params.id,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!company) {
      return apiError("Company not found", 404);
    }

    return apiResponse({
      message: "Company approved successfully",
      company,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to approve company", 500);
  }
}