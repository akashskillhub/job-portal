import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { updateJobSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const job = await Job.findOne({
      _id: params.id,
      companyId: session.user.id,
    })
      .populate("allowedColleges", "name")
      .lean();

    if (!job) {
      return apiError("Job not found", 404);
    }

    return apiResponse({ job });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch job", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const body = await req.json();
    const validatedData = updateJobSchema.parse(body);

    const job = await Job.findOneAndUpdate(
      { _id: params.id, companyId: session.user.id },
      validatedData,
      { new: true }
    );

    if (!job) {
      return apiError("Job not found", 404);
    }

    return apiResponse({
      message: "Job updated successfully",
      job,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to update job", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const job = await Job.findOneAndDelete({
      _id: params.id,
      companyId: session.user.id,
    });

    if (!job) {
      return apiError("Job not found", 404);
    }

    return apiResponse({ message: "Job deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete job", 500);
  }
}