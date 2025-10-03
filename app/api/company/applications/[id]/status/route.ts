import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { updateApplicationStatusSchema } from "@/lib/validations";
import { apiError, apiResponse } from "@/lib/middleware";
import { EmailService } from "@/lib/email";

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
    const validatedData = updateApplicationStatusSchema.parse(body);

    // Get the application with student, job and company details
    const application = await Application.findById(params.id)
      .populate("jobId")
      .populate("studentId");

    if (!application) {
      return apiError("Application not found", 404);
    }

    // Check if the job belongs to this company
    if (application.jobId.companyId.toString() !== session.user.id) {
      return apiError("Forbidden", 403);
    }

    // Get company details
    const Company = (await import("@/models/Company")).default;
    const company = await Company.findById(session.user.id);

    // Update status
    const oldStatus = application.status;
    application.status = validatedData.status;
    application.statusUpdatedAt = new Date();
    await application.save();

    // Send email notification to student if status changed
    if (oldStatus !== validatedData.status && application.studentId) {
      const studentName = `${application.studentId.firstName} ${application.studentId.lastName}`;
      const jobTitle = application.jobId.title;
      const companyName = company?.name || "Company";

      // Send email in background (don't wait for it)
      EmailService.sendApplicationStatusChange(
        application.studentId.email,
        studentName,
        jobTitle,
        companyName,
        validatedData.status
      ).catch((err) => console.error("Email send error:", err));
    }

    return apiResponse({
      message: "Application status updated successfully",
      application,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError(error.errors[0].message, 400);
    }
    return apiError(error.message || "Failed to update application status", 500);
  }
}