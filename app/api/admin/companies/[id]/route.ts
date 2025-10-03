import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { apiError, apiResponse } from "@/lib/middleware";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { id } = await params;
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return apiError("Company not found", 404);
    }

    return apiResponse({ message: "Company deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete company", 500);
  }
}