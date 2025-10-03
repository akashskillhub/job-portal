import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "college") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    // Get all placements (hired status) for students from this college
    const placements = await Application.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $match: {
          "student.collegeId": session.user.id,
          status: "hired",
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $lookup: {
          from: "companies",
          localField: "job.companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          studentName: {
            $concat: ["$student.firstName", " ", "$student.lastName"],
          },
          studentEmail: "$student.email",
          jobTitle: "$job.title",
          companyName: "$company.name",
          hiredAt: "$statusUpdatedAt",
        },
      },
      { $sort: { hiredAt: -1 } },
    ]);

    return apiResponse({ placements });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch placements", 500);
  }
}