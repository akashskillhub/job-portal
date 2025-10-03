import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    let query = {};
    if (filter === "pending") {
      query = { isApproved: false };
    } else if (filter === "approved") {
      query = { isApproved: true };
    }

    const companies = await Company.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ companies });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch companies", 500);
  }
}