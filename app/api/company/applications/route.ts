import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    // Get all jobs for this company
    const companyJobs = await Job.find({ companyId: session.user.id }).select("_id");
    const jobIds = companyJobs.map((job) => job._id);

    let query: any = { jobId: { $in: jobIds } };

    if (jobId) {
      query.jobId = jobId;
    }

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate("studentId", "firstName lastName email phone cgpa stream resumeUrl")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse({ applications });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch applications", 500);
  }
}