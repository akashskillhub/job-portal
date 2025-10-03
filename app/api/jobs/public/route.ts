import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Fetch all active jobs with deadline in the future
    const jobs = await Job.find({
      applicationDeadline: { $gte: new Date() },
    })
      .populate("companyId", "name industry city")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ jobs });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch jobs", 500);
  }
}
