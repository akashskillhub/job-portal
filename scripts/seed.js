const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/college-job-portal";

// Define schemas inline
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  role: { type: String, default: "college" },
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  website: { type: String },
  industry: { type: String, required: true },
  size: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: "company" },
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  rollNumber: { type: String, required: true },
  stream: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String },
  skills: { type: [String], default: [] },
  role: { type: String, default: "student" },
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  skills: { type: [String], required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "INR" },
  },
  allowedColleges: { type: [mongoose.Schema.Types.ObjectId], ref: "College", default: [] },
  allowedStreams: { type: [String], required: true },
  minCGPA: { type: Number, required: true },
  applicationDeadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["applied", "shortlisted", "rejected", "hired"], default: "applied" },
  appliedAt: { type: Date, default: Date.now },
  statusUpdatedAt: { type: Date, default: Date.now },
  coverLetter: { type: String },
}, { timestamps: true });

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Get or create models
    const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
    const College = mongoose.models.College || mongoose.model("College", collegeSchema);
    const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
    const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
    const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
    const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      College.deleteMany({}),
      Company.deleteMany({}),
      Student.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
    ]);
    console.log("✓ Cleared existing data");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create Admin
    await Admin.create({
      email: "admin@example.com",
      password: hashedPassword,
      name: "System Administrator",
    });
    console.log("✓ Created admin account");

    // Create Colleges
    const colleges = await College.insertMany([
      {
        name: "MIT Engineering College",
        email: "mit@example.com",
        password: hashedPassword,
        address: "123 College Street",
        city: "Chennai",
        state: "Tamil Nadu",
        phone: "9876543210",
        establishedYear: 1949,
      },
      {
        name: "Anna University",
        email: "anna@example.com",
        password: hashedPassword,
        address: "456 University Road",
        city: "Chennai",
        state: "Tamil Nadu",
        phone: "9876543211",
        establishedYear: 1978,
      },
    ]);
    console.log(`✓ Created ${colleges.length} colleges`);

    // Create Companies
    const companies = await Company.insertMany([
      {
        name: "TechCorp Solutions",
        email: "hr@techcorp.com",
        password: hashedPassword,
        website: "https://techcorp.com",
        industry: "Information Technology",
        size: "501-1000",
        description: "Leading IT solutions provider",
        address: "789 Tech Park",
        city: "Bangalore",
        state: "Karnataka",
        phone: "9876543212",
        isApproved: true,
      },
      {
        name: "InnovateSoft",
        email: "careers@innovatesoft.com",
        password: hashedPassword,
        website: "https://innovatesoft.com",
        industry: "Software Development",
        size: "51-200",
        description: "Innovative software solutions",
        address: "321 Innovation Hub",
        city: "Hyderabad",
        state: "Telangana",
        phone: "9876543213",
        isApproved: true,
      },
      {
        name: "DataMinds Analytics",
        email: "hiring@dataminds.com",
        password: hashedPassword,
        website: "https://dataminds.com",
        industry: "Data Analytics",
        size: "11-50",
        description: "Data analytics and AI solutions",
        address: "555 Data Street",
        city: "Pune",
        state: "Maharashtra",
        phone: "9876543214",
        isApproved: false,
      },
    ]);
    console.log(`✓ Created ${companies.length} companies (1 pending approval)`);

    // Create Students
    const students = await Student.insertMany([
      {
        email: "john.doe@student.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        collegeId: colleges[0]._id,
        rollNumber: "CS2021001",
        stream: "Computer Science",
        graduationYear: 2025,
        cgpa: 8.5,
        phone: "9876543215",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      },
      {
        email: "jane.smith@student.com",
        password: hashedPassword,
        firstName: "Jane",
        lastName: "Smith",
        collegeId: colleges[0]._id,
        rollNumber: "CS2021002",
        stream: "Computer Science",
        graduationYear: 2025,
        cgpa: 9.0,
        phone: "9876543216",
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
      },
      {
        email: "raj.kumar@student.com",
        password: hashedPassword,
        firstName: "Raj",
        lastName: "Kumar",
        collegeId: colleges[1]._id,
        rollNumber: "IT2021001",
        stream: "Information Technology",
        graduationYear: 2025,
        cgpa: 7.8,
        phone: "9876543217",
        skills: ["Java", "Spring Boot", "MySQL", "Docker"],
      },
      {
        email: "priya.patel@student.com",
        password: hashedPassword,
        firstName: "Priya",
        lastName: "Patel",
        collegeId: colleges[1]._id,
        rollNumber: "EC2021001",
        stream: "Electronics",
        graduationYear: 2025,
        cgpa: 8.2,
        phone: "9876543218",
        skills: ["Embedded Systems", "IoT", "C++", "Arduino"],
      },
    ]);
    console.log(`✓ Created ${students.length} students`);

    // Create Jobs
    const jobs = await Job.insertMany([
      {
        companyId: companies[0]._id,
        title: "Full Stack Developer",
        description: "We are looking for a talented Full Stack Developer to join our team.",
        requirements: [
          "Strong knowledge of JavaScript",
          "Experience with React and Node.js",
          "Understanding of RESTful APIs",
        ],
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
        location: "Bangalore",
        jobType: "Full-time",
        salary: { min: 600000, max: 900000, currency: "INR" },
        allowedColleges: [colleges[0]._id, colleges[1]._id],
        allowedStreams: ["Computer Science", "Information Technology"],
        minCGPA: 7.5,
        applicationDeadline: new Date("2025-12-31"),
        isActive: true,
      },
      {
        companyId: companies[1]._id,
        title: "Data Analyst Intern",
        description: "Exciting internship opportunity for data enthusiasts.",
        requirements: [
          "Knowledge of Python and SQL",
          "Understanding of data visualization",
          "Analytical mindset",
        ],
        skills: ["Python", "SQL", "Excel", "Tableau"],
        location: "Hyderabad",
        jobType: "Internship",
        salary: { min: 20000, max: 30000, currency: "INR" },
        allowedColleges: [],
        allowedStreams: ["Computer Science", "Information Technology", "Electronics"],
        minCGPA: 7.0,
        applicationDeadline: new Date("2025-11-30"),
        isActive: true,
      },
      {
        companyId: companies[0]._id,
        title: "Backend Developer",
        description: "Join our backend team to build scalable microservices.",
        requirements: [
          "Experience with Java or Node.js",
          "Knowledge of databases",
          "Understanding of cloud platforms",
        ],
        skills: ["Java", "Spring Boot", "MySQL", "AWS"],
        location: "Bangalore",
        jobType: "Full-time",
        salary: { min: 700000, max: 1000000, currency: "INR" },
        allowedColleges: [colleges[0]._id],
        allowedStreams: ["Computer Science", "Information Technology"],
        minCGPA: 8.0,
        applicationDeadline: new Date("2025-12-15"),
        isActive: true,
      },
    ]);
    console.log(`✓ Created ${jobs.length} jobs`);

    // Create Applications
    const applications = await Application.insertMany([
      {
        jobId: jobs[0]._id,
        studentId: students[0]._id,
        status: "applied",
        coverLetter: "I am very interested in this position and believe my skills align well.",
      },
      {
        jobId: jobs[0]._id,
        studentId: students[1]._id,
        status: "shortlisted",
        coverLetter: "I have strong experience in full stack development.",
      },
      {
        jobId: jobs[1]._id,
        studentId: students[2]._id,
        status: "hired",
        coverLetter: "I am passionate about data analysis and eager to learn.",
      },
      {
        jobId: jobs[2]._id,
        studentId: students[1]._id,
        status: "applied",
        coverLetter: "My backend development skills would be a great fit.",
      },
    ]);
    console.log(`✓ Created ${applications.length} applications`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📋 Sample Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔐 Admin:");
    console.log("   Email: admin@example.com");
    console.log("   Password: password123");
    console.log("\n🏫 College 1:");
    console.log("   Email: mit@example.com");
    console.log("   Password: password123");
    console.log("\n🏫 College 2:");
    console.log("   Email: anna@example.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 1 (Approved):");
    console.log("   Email: hr@techcorp.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 2 (Approved):");
    console.log("   Email: careers@innovatesoft.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 3 (Pending Approval):");
    console.log("   Email: hiring@dataminds.com");
    console.log("   Password: password123");
    console.log("\n🎓 Student 1:");
    console.log("   Email: john.doe@student.com");
    console.log("   Password: password123");
    console.log("\n🎓 Student 2:");
    console.log("   Email: jane.smith@student.com");
    console.log("   Password: password123");
    console.log("\n🎓 Student 3:");
    console.log("   Email: raj.kumar@student.com");
    console.log("   Password: password123");
    console.log("\n🎓 Student 4:");
    console.log("   Email: priya.patel@student.com");
    console.log("   Password: password123");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();