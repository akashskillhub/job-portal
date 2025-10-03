import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASS,
  },
});

// Email templates
const emailTemplates = {
  welcome: (name: string, role: string) => ({
    subject: "Welcome to College Job Portal",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">Welcome to College Job Portal!</h2>
        <p>Hello ${name},</p>
        <p>Your ${role} account has been successfully created.</p>
        <p>You can now log in and start using the platform.</p>
        <br/>
        <p>Best regards,<br/>College Job Portal Team</p>
      </div>
    `,
  }),

  applicationStatusChange: (
    studentName: string,
    jobTitle: string,
    companyName: string,
    status: string
  ) => ({
    subject: `Application Status Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">Application Status Update</h2>
        <p>Hello ${studentName},</p>
        <p>Your application status for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
        <p style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #800000;">
          <strong>New Status:</strong> ${status.toUpperCase()}
        </p>
        ${
          status === "shortlisted"
            ? "<p>Congratulations! You've been shortlisted. The company will contact you soon.</p>"
            : status === "hired"
            ? "<p>🎉 Congratulations! You've been selected for the position!</p>"
            : status === "rejected"
            ? "<p>Thank you for your interest. We encourage you to apply for other opportunities.</p>"
            : ""
        }
        <p>Log in to your dashboard to view more details.</p>
        <br/>
        <p>Best regards,<br/>College Job Portal Team</p>
      </div>
    `,
  }),

  newApplication: (
    companyName: string,
    studentName: string,
    jobTitle: string
  ) => ({
    subject: `New Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">New Application Received</h2>
        <p>Hello ${companyName},</p>
        <p>You have received a new application for the position: <strong>${jobTitle}</strong></p>
        <p><strong>Candidate:</strong> ${studentName}</p>
        <p>Log in to your dashboard to review the application and candidate profile.</p>
        <br/>
        <p>Best regards,<br/>College Job Portal Team</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetToken: string) => ({
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p style="margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}"
             style="background-color: #800000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666;">This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Best regards,<br/>College Job Portal Team</p>
      </div>
    `,
  }),

  jobPostedNotification: (
    studentName: string,
    jobTitle: string,
    companyName: string,
    location: string
  ) => ({
    subject: `New Job Opportunity - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">New Job Opportunity Matching Your Profile</h2>
        <p>Hello ${studentName},</p>
        <p>A new job opportunity has been posted that matches your profile:</p>
        <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #800000; margin: 20px 0;">
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>
        <p>Log in to your dashboard to view full details and apply.</p>
        <br/>
        <p>Best regards,<br/>College Job Portal Team</p>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(to: string, template: any) {
  try {
    const mailOptions = {
      from: `College Job Portal <${process.env.FROM_EMAIL}>`,
      to,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Helper functions for each email type
export const EmailService = {
  sendWelcomeEmail: async (to: string, name: string, role: string) => {
    return sendEmail(to, emailTemplates.welcome(name, role));
  },

  sendApplicationStatusChange: async (
    to: string,
    studentName: string,
    jobTitle: string,
    companyName: string,
    status: string
  ) => {
    return sendEmail(
      to,
      emailTemplates.applicationStatusChange(
        studentName,
        jobTitle,
        companyName,
        status
      )
    );
  },

  sendNewApplicationNotification: async (
    to: string,
    companyName: string,
    studentName: string,
    jobTitle: string
  ) => {
    return sendEmail(
      to,
      emailTemplates.newApplication(companyName, studentName, jobTitle)
    );
  },

  sendPasswordResetEmail: async (
    to: string,
    name: string,
    resetToken: string
  ) => {
    return sendEmail(to, emailTemplates.passwordReset(name, resetToken));
  },

  sendJobPostedNotification: async (
    to: string,
    studentName: string,
    jobTitle: string,
    companyName: string,
    location: string
  ) => {
    return sendEmail(
      to,
      emailTemplates.jobPostedNotification(
        studentName,
        jobTitle,
        companyName,
        location
      )
    );
  },

  sendEmailVerification: async (
    to: string,
    name: string,
    verificationUrl: string
  ) => {
    const subject = "Verify Your Email - College Job Portal";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000;">Email Verification Required</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with College Job Portal! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #800000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't register for this account, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">College Job Portal - Connecting Students with Opportunities</p>
      </div>
    `;
    return sendEmail(to, { subject, html });
  },
};
