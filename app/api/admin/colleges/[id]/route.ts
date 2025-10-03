import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { apiError, apiResponse } from "@/lib/middleware";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await dbConnect();

    const college = await College.findByIdAndDelete(params.id);

    if (!college) {
      return apiError("College not found", 404);
    }

    return apiResponse({ message: "College deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete college", 500);
  }
}