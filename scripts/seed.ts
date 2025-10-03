import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env") });

// Import models
import Admin from "../models/Admin";
import College from "../models/College";
import Company from "../models/Company";
import Student from "../models/Student";
import Job from "../models/Job";
import Application from "../models/Application";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/college-job-portal";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

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
    const admin = await Admin.create({
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
        description: "Leading IT solutions provider specializing in enterprise software",
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
        description: "Innovative software solutions for startups and enterprises",
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
        description: "Data analytics and AI solutions for business intelligence",
        address: "555 Data Street",
        city: "Pune",
        state: "Maharashtra",
        phone: "9876543214",
        isApproved: true,
      },
      {
        name: "CloudNine Technologies",
        email: "jobs@cloudnine.com",
        password: hashedPassword,
        website: "https://cloudnine.com",
        industry: "Cloud Computing",
        size: "201-500",
        description: "Cloud infrastructure and DevOps solutions provider",
        address: "42 Cloud Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        phone: "9876543215",
        isApproved: true,
      },
      {
        name: "CyberSecure India",
        email: "recruitment@cybersecure.in",
        password: hashedPassword,
        website: "https://cybersecure.in",
        industry: "Cybersecurity",
        size: "51-200",
        description: "Comprehensive cybersecurity solutions and consulting",
        address: "88 Security Plaza",
        city: "Delhi",
        state: "Delhi",
        phone: "9876543216",
        isApproved: true,
      },
      {
        name: "FinTech Solutions Ltd",
        email: "hr@fintech.com",
        password: hashedPassword,
        website: "https://fintech.com",
        industry: "Financial Technology",
        size: "201-500",
        description: "Digital payment solutions and banking technology",
        address: "234 Finance Tower",
        city: "Bangalore",
        state: "Karnataka",
        phone: "9876543217",
        isApproved: true,
      },
      {
        name: "AI Innovations Hub",
        email: "careers@aiinnovations.com",
        password: hashedPassword,
        website: "https://aiinnovations.com",
        industry: "Artificial Intelligence",
        size: "51-200",
        description: "Machine learning and AI research and development",
        address: "77 AI Street",
        city: "Pune",
        state: "Maharashtra",
        phone: "9876543218",
        isApproved: true,
      },
      {
        name: "MobileFirst Apps",
        email: "jobs@mobilefirst.com",
        password: hashedPassword,
        website: "https://mobilefirst.com",
        industry: "Mobile Development",
        size: "51-200",
        description: "iOS and Android app development company",
        address: "99 App Lane",
        city: "Chennai",
        state: "Tamil Nadu",
        phone: "9876543219",
        isApproved: true,
      },
      {
        name: "GameDev Studios",
        email: "hr@gamedev.com",
        password: hashedPassword,
        website: "https://gamedev.com",
        industry: "Gaming",
        size: "51-200",
        description: "Game development and interactive entertainment",
        address: "123 Gaming Street",
        city: "Hyderabad",
        state: "Telangana",
        phone: "9876543220",
        isApproved: true,
      },
      {
        name: "EduTech Platform",
        email: "careers@edutech.com",
        password: hashedPassword,
        website: "https://edutech.com",
        industry: "Education Technology",
        size: "201-500",
        description: "Online learning platforms and educational software",
        address: "456 Education Hub",
        city: "Bangalore",
        state: "Karnataka",
        phone: "9876543221",
        isApproved: false, // Pending approval
      },
    ]);
    console.log(`✓ Created ${companies.length} companies (9 approved, 1 pending approval)`);

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
        salary: {
          min: 600000,
          max: 900000,
          currency: "INR",
        },
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
        salary: {
          min: 20000,
          max: 30000,
          currency: "INR",
        },
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
        salary: {
          min: 700000,
          max: 1000000,
          currency: "INR",
        },
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
        jobId: jobs[0]._id,
        studentId: students[2]._id,
        status: "applied",
        coverLetter: "I would love to work on full stack projects.",
      },
      {
        jobId: jobs[0]._id,
        studentId: students[3]._id,
        status: "rejected",
        coverLetter: "I am eager to contribute to your team.",
      },
      {
        jobId: jobs[1]._id,
        studentId: students[0]._id,
        status: "applied",
        coverLetter: "Data analysis is my passion and I'm excited about this opportunity.",
      },
      {
        jobId: jobs[1]._id,
        studentId: students[1]._id,
        status: "shortlisted",
        coverLetter: "I have strong analytical skills and experience with data visualization.",
      },
      {
        jobId: jobs[1]._id,
        studentId: students[2]._id,
        status: "hired",
        coverLetter: "I am passionate about data analysis and eager to learn.",
      },
      {
        jobId: jobs[1]._id,
        studentId: students[3]._id,
        status: "applied",
        coverLetter: "Looking forward to applying my skills in data analysis.",
      },
      {
        jobId: jobs[2]._id,
        studentId: students[0]._id,
        status: "applied",
        coverLetter: "I have experience with backend technologies and microservices.",
      },
      {
        jobId: jobs[2]._id,
        studentId: students[1]._id,
        status: "applied",
        coverLetter: "My backend development skills would be a great fit.",
      },
      {
        jobId: jobs[2]._id,
        studentId: students[2]._id,
        status: "shortlisted",
        coverLetter: "I am proficient in Java and Spring Boot.",
      },
      {
        jobId: jobs[2]._id,
        studentId: students[3]._id,
        status: "applied",
        coverLetter: "Excited to work on scalable backend systems.",
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
    console.log("\n🏢 Company 1 - TechCorp Solutions (Approved):");
    console.log("   Email: hr@techcorp.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 2 - InnovateSoft (Approved):");
    console.log("   Email: careers@innovatesoft.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 3 - DataMinds Analytics (Approved):");
    console.log("   Email: hiring@dataminds.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 4 - CloudNine Technologies (Approved):");
    console.log("   Email: jobs@cloudnine.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 5 - CyberSecure India (Approved):");
    console.log("   Email: recruitment@cybersecure.in");
    console.log("   Password: password123");
    console.log("\n🏢 Company 6 - FinTech Solutions Ltd (Approved):");
    console.log("   Email: hr@fintech.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 7 - AI Innovations Hub (Approved):");
    console.log("   Email: careers@aiinnovations.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 8 - MobileFirst Apps (Approved):");
    console.log("   Email: jobs@mobilefirst.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 9 - GameDev Studios (Approved):");
    console.log("   Email: hr@gamedev.com");
    console.log("   Password: password123");
    console.log("\n🏢 Company 10 - EduTech Platform (Pending Approval):");
    console.log("   Email: careers@edutech.com");
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

// Run seed
seedDatabase();