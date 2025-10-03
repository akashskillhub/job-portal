import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const colleges = await College.find().select("_id name city state").lean();
    return apiResponse({ colleges });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch colleges", 500);
  }
}