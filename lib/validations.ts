import { z } from "zod";

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "college", "company", "student"]),
});

export const companySignUpSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().min(2, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

// Admin schemas
export const createCollegeSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()),
});

export const createStudentSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  collegeId: z.string().min(1, "College is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  stream: z.enum([
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical",
    "Biotechnology",
    "Other",
  ]),
  graduationYear: z.number().min(2020).max(2030),
  cgpa: z.number().min(0).max(10),
  phone: z.string().min(10, "Valid phone number is required"),
  skills: z.array(z.string()).default([]),
});

export const updateStudentSchema = createStudentSchema.partial().omit({ password: true });

// Job schemas
export const createJobSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.array(z.string()).default([]),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string().min(2, "Location is required"),
  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),
  salary: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string().default("INR"),
    })
    .optional(),
  allowedColleges: z.array(z.string()).default([]),
  allowedStreams: z.array(z.string()).min(1, "At least one stream is required"),
  minCGPA: z.number().min(0).max(10),
  applicationDeadline: z.string().or(z.date()),
});

export const updateJobSchema = createJobSchema.partial();

// Application schemas
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["applied", "shortlisted", "rejected", "hired"]),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type CompanySignUpInput = z.infer<typeof companySignUpSchema>;
export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;