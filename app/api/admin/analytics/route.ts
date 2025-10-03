import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Company from "@/models/Company";
import Job from "@/models/Job";
import Application from "@/models/Application";
import College from "@/models/College";
import { apiError, apiResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    // Get total counts
    const [totalStudents, totalCompanies, totalColleges, totalJobs, totalApplications] =
      await Promise.all([
        Student.countDocuments(),
        Company.countDocuments({ isApproved: true }),
        College.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
      ]);

    // Get placements count (hired status)
    const totalPlacements = await Application.countDocuments({ status: "hired" });

    // Get placements per college
    const placementsPerCollege = await Application.aggregate([
      { $match: { status: "hired" } },
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
        $lookup: {
          from: "colleges",
          localField: "student.collegeId",
          foreignField: "_id",
          as: "college",
        },
      },
      { $unwind: "$college" },
      {
        $group: {
          _id: "$college._id",
          collegeName: { $first: "$college.name" },
          placements: { $sum: 1 },
        },
      },
      { $sort: { placements: -1 } },
    ]);

    // Get pending company approvals
    const pendingApprovals = await Company.countDocuments({ isApproved: false });

    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("studentId", "firstName lastName email")
      .populate("jobId", "title")
      .lean();

    return apiResponse({
      totalStudents,
      totalCompanies,
      totalColleges,
      totalJobs,
      totalApplications,
      totalPlacements,
      pendingApprovals,
      placementsPerCollege,
      recentApplications,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch analytics", 500);
  }
}