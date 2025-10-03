# MGM University Job Portal

A comprehensive placement management system designed to connect students with career opportunities through streamlined job applications and AI-powered skill matching.

## Overview

MGM University Job Portal is a modern web application built with Next.js 15 that facilitates seamless placement management for students, companies, colleges, and administrators. The platform offers intelligent job matching, real-time notifications, and comprehensive analytics to ensure successful campus placements.

## Features

### For Students
- **AI-Powered Job Matching**: Intelligent skill-based recommendations with 40% matching threshold
- **Easy Application Process**: Apply to multiple jobs with a single click
- **Real-Time Notifications**: Instant email updates on new job postings and application status
- **Profile Management**: Create and maintain comprehensive student profiles with skills and preferences
- **Application Tracking**: Monitor all job applications in one centralized dashboard
- **Resume Management**: Upload and manage resume documents (PDF format, max 5MB)
- **Skill Matching**: View match percentage for each job listing

### For Companies
- **Job Posting Management**: Create and manage job listings with detailed requirements
- **Candidate Filtering**: Filter students by skills, CGPA, department, and more
- **Application Management**: Review and manage student applications efficiently
- **Company Profile**: Showcase company information, industry, and culture
- **Approval Workflow**: Admin verification ensures quality partnerships
- **Application Status Updates**: Update candidate status (shortlisted, rejected, hired)

### For Colleges
- **Student Management**: Oversee student profiles and placement activities
- **Placement Analytics**: Track placement metrics and performance statistics
- **Company Collaboration**: Facilitate partnerships with recruiting companies
- **Comprehensive Reports**: Generate detailed placement reports
- **Student Monitoring**: View all students from your college

### For Administrators
- **Complete Platform Control**: Manage all users, companies, and job postings
- **Approval System**: Verify and approve company registrations
- **Analytics Dashboard**: Monitor platform-wide metrics and activities
- **User Management**: Create and manage colleges and students
- **Company Verification**: Review and approve company registrations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)
- **Email Service**: Nodemailer
- **Validation**: Custom middleware and validators

## Color Scheme

- **Primary**: #800000 (Deep Maroon)
- **Secondary**: #FFD700 (Golden Yellow)

## Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB database (local or cloud)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mgm-zip
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key_here

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here

   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   ```

4. **Generate secure secrets**
   ```bash
   # Generate NEXTAUTH_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

## Test Credentials

After seeding the database (see [Database Setup](#database-setup) below), you can use these test accounts:

### Admin Account
- **Email:** admin@example.com
- **Password:** password123
- **Login URL:** `/auth/signin?role=admin`

### Student Accounts

**Student 1 - John Doe**
- **Email:** john.doe@student.com
- **Password:** password123
- **College:** MIT Engineering College
- **Stream:** Computer Science
- **CGPA:** 8.5
- **Skills:** JavaScript, React, Node.js, MongoDB

**Student 2 - Jane Smith**
- **Email:** jane.smith@student.com
- **Password:** password123
- **College:** MIT Engineering College
- **Stream:** Computer Science
- **CGPA:** 9.0
- **Skills:** Python, Machine Learning, TensorFlow, Data Analysis

**Student 3 - Raj Kumar**
- **Email:** raj.kumar@student.com
- **Password:** password123
- **College:** Anna University
- **Stream:** Information Technology
- **CGPA:** 7.8
- **Skills:** Java, Spring Boot, MySQL, Docker

**Student 4 - Priya Patel**
- **Email:** priya.patel@student.com
- **Password:** password123
- **College:** Anna University
- **Stream:** Electronics
- **CGPA:** 8.2
- **Skills:** Embedded Systems, IoT, C++, Arduino

### Company Accounts

**Company 1 - TechCorp Solutions (Approved)**
- **Email:** hr@techcorp.com
- **Password:** password123
- **Industry:** Information Technology
- **Size:** 501-1000
- **Location:** Bangalore, Karnataka
- **Status:** Approved

**Company 2 - InnovateSoft (Approved)**
- **Email:** careers@innovatesoft.com
- **Password:** password123
- **Industry:** Software Development
- **Size:** 51-200
- **Location:** Hyderabad, Telangana
- **Status:** Approved

**Company 3 - DataMinds Analytics (Approved)**
- **Email:** hiring@dataminds.com
- **Password:** password123
- **Industry:** Data Analytics
- **Size:** 11-50
- **Location:** Pune, Maharashtra
- **Status:** Approved

**Company 4 - CloudNine Technologies (Approved)**
- **Email:** jobs@cloudnine.com
- **Password:** password123
- **Industry:** Cloud Computing
- **Size:** 201-500
- **Location:** Mumbai, Maharashtra
- **Status:** Approved

**Company 5 - CyberSecure India (Approved)**
- **Email:** recruitment@cybersecure.in
- **Password:** password123
- **Industry:** Cybersecurity
- **Size:** 101-200
- **Location:** Delhi
- **Status:** Approved

**Company 6 - FinTech Solutions Ltd (Approved)**
- **Email:** hr@fintech.com
- **Password:** password123
- **Industry:** Financial Technology
- **Size:** 301-500
- **Location:** Bangalore, Karnataka
- **Status:** Approved

**Company 7 - AI Innovations Hub (Approved)**
- **Email:** careers@aiinnovations.com
- **Password:** password123
- **Industry:** Artificial Intelligence
- **Size:** 51-100
- **Location:** Pune, Maharashtra
- **Status:** Approved

**Company 8 - MobileFirst Apps (Approved)**
- **Email:** jobs@mobilefirst.com
- **Password:** password123
- **Industry:** Mobile Development
- **Size:** 51-100
- **Location:** Chennai, Tamil Nadu
- **Status:** Approved

**Company 9 - GameDev Studios (Approved)**
- **Email:** hr@gamedev.com
- **Password:** password123
- **Industry:** Gaming
- **Size:** 101-200
- **Location:** Hyderabad, Telangana
- **Status:** Approved

**Company 10 - EduTech Platform (Pending Approval)**
- **Email:** careers@edutech.com
- **Password:** password123
- **Industry:** Education Technology
- **Size:** 201-300
- **Location:** Bangalore, Karnataka
- **Status:** Pending Approval (requires admin approval)

### College Accounts

**MIT Engineering College**
- **Email:** mit@example.com
- **Password:** password123

**Anna University**
- **Email:** anna@example.com
- **Password:** password123

## Database Setup

### Seed the Database

To populate the database with sample data including the test accounts above:

```bash
npm run seed
```

This will create:
- 1 Admin account
- 2 Colleges
- 10 Companies (9 approved, 1 pending)
- 4 Students
- 3 Jobs
- 4 Sample applications

## Project Structure

```
mgm-zip/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── admin/          # Admin endpoints
│   │   ├── student/        # Student endpoints
│   │   ├── company/        # Company endpoints
│   │   ├── college/        # College endpoints
│   │   └── jobs/           # Public job endpoints
│   ├── admin/              # Admin dashboard pages
│   ├── student/            # Student dashboard pages
│   ├── company/            # Company dashboard pages
│   ├── college/            # College dashboard pages
│   ├── auth/               # Authentication pages
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── jobs/               # Public jobs page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── navbar.tsx          # Navigation bar
│   ├── footer.tsx          # Footer component
│   ├── theme-provider.tsx  # Theme provider
│   └── ...
├── lib/                     # Utility functions
│   ├── mongodb.ts          # Database connection
│   ├── auth.ts             # NextAuth configuration
│   ├── middleware.ts       # API middleware
│   ├── email.ts            # Email service
│   └── utils.ts            # Helper functions
├── models/                  # Mongoose models
│   ├── User.ts             # User model (Admin, College)
│   ├── Student.ts          # Student model
│   ├── Company.ts          # Company model
│   ├── Job.ts              # Job model
│   └── Application.ts      # Application model
├── public/                  # Static assets
│   ├── mgm-logo.svg        # University logo
│   └── uploads/            # Uploaded files
│       └── resumes/        # Student resumes
└── package.json
```

## Usage

### User Roles and Access

1. **Admin**
   - Login at: `/auth/signin?role=admin`
   - Manage entire platform
   - Approve companies
   - Create colleges and students
   - View analytics

2. **Student**
   - Register at: `/auth/student-signup`
   - Login at: `/auth/signin?role=student`
   - Browse and apply to jobs
   - Track applications
   - Upload resume

3. **Company**
   - Register at: `/auth/signup?role=company`
   - Login at: `/auth/signin?role=company`
   - Post jobs (after admin approval)
   - Review applications
   - Update candidate status

4. **College**
   - Login at: `/auth/signin?role=college`
   - View students
   - Monitor placements
   - View statistics

### Key Workflows

#### Student Job Application Flow
1. Student registers and completes profile with skills
2. Browse public jobs or login to see AI-matched recommendations
3. View match percentage for each job
4. Apply to relevant jobs with one click
5. Receive email notifications on status updates
6. Track all applications in dashboard

#### Company Job Posting Flow
1. Company registers on the platform
2. Admin reviews and approves company
3. Company creates job postings with requirements
4. Students apply to jobs
5. Company reviews applications
6. Company updates application status
7. Students receive email notifications

## Features in Detail

### AI-Powered Skill Matching
The platform uses an intelligent algorithm to match student skills with job requirements:
- Calculates skill match percentage based on overlap
- Shows only jobs with 40%+ match rate
- Prioritizes relevant opportunities in student dashboard
- Displays match percentage badge on job cards

### Real-Time Email Notifications
Automated email notifications for:
- **Students**: New matching jobs, application status changes
- **Companies**: New applications received
- **Admins**: New company registrations pending approval

### Job Eligibility System
Students can only apply to jobs that match:
- Their college (if job is college-specific)
- Their department/stream
- Minimum CGPA requirement
- Application deadline hasn't passed
- Minimum skill match threshold (40%)

### Application Status Workflow
1. **Applied** - Student submits application
2. **Shortlisted** - Company shortlists candidate for interview
3. **Rejected** - Application not selected
4. **Hired** - Student successfully placed (counted in statistics)

### Responsive Design
- Fully responsive across all devices (mobile, tablet, desktop)
- Mobile-friendly navigation with hamburger menu
- Touch-optimized interface
- Adaptive layouts and components

### Dark Mode Support
- System preference detection
- Manual theme toggle in navbar
- Persistent theme selection
- Smooth transitions between themes

## API Routes

### Authentication
- `POST /api/auth/signup` - Company/Student registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Public Routes
- `GET /api/jobs/public` - Browse jobs without authentication

### Admin Routes
- `GET /api/admin/analytics` - Dashboard analytics
- `GET /api/admin/colleges` - List/manage colleges
- `POST /api/admin/colleges` - Create college
- `GET /api/admin/students` - List/manage students
- `POST /api/admin/students` - Create student
- `GET /api/admin/companies` - List companies
- `PATCH /api/admin/companies/[id]/approve` - Approve company

### Company Routes
- `GET /api/company/jobs` - List company jobs
- `POST /api/company/jobs` - Create job posting
- `PATCH /api/company/jobs/[id]` - Update job
- `DELETE /api/company/jobs/[id]` - Delete job
- `GET /api/company/applications` - View applications
- `PATCH /api/company/applications/[id]/status` - Update status

### Student Routes
- `GET /api/student/jobs` - Get AI-matched jobs
- `POST /api/student/applications` - Submit application
- `GET /api/student/applications` - Track applications
- `PATCH /api/student/profile` - Update profile
- `POST /api/student/resume` - Upload resume

### College Routes
- `GET /api/college/students` - View college students
- `GET /api/college/placements` - Placement statistics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL (http://localhost:3000) | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key (generate with crypto) | Yes |
| `JWT_SECRET` | JWT secret key (generate with crypto) | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail app-specific password | Yes |

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akashskillhub/job-portal)

#### Step-by-Step Deployment:

1. **Push your code to GitHub** (Already done ✅)

2. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login with your GitHub account

3. **Import your repository**
   - Click "Add New Project"
   - Select your GitHub repository: `akashskillhub/job-portal`
   - Click "Import"

4. **Configure Environment Variables**

   In Vercel dashboard, add these environment variables:

   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your_generated_secret_key
   JWT_SECRET=your_generated_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

   **To generate secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-app-name.vercel.app`

6. **Seed the Production Database**

   After deployment, run the seed script with your production database:

   ```bash
   # Update .env with production MONGODB_URI
   npm run seed
   ```

#### Important Notes:

- ⚠️ **MongoDB Atlas**: Make sure to use MongoDB Atlas (cloud) for production, not localhost
- ⚠️ **Whitelist IPs**: In MongoDB Atlas, whitelist Vercel's IP addresses (or use 0.0.0.0/0)
- ⚠️ **NEXTAUTH_URL**: Must match your Vercel deployment URL
- ⚠️ **Gmail**: Enable 2-factor authentication and create an app-specific password

#### Post-Deployment:

1. **Test the application**
   - Visit your deployed URL
   - Test login with seeded accounts
   - Verify email notifications work

2. **Monitor logs**
   - Check Vercel dashboard for any errors
   - Monitor MongoDB Atlas for database connections

3. **Custom Domain (Optional)**
   - Go to Vercel Project Settings
   - Add your custom domain
   - Update `NEXTAUTH_URL` environment variable

### Alternative Deployment Options

#### Deploy to Railway
1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy

#### Deploy to Render
1. Sign up at [render.com](https://render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

## Development Team

**Designed and Developed by:**

- **Sakshi Markal** - Full Stack Developer
  - Frontend & Backend Development
  - Database Design
  - UI/UX Implementation

- **Pratiksha Shinde** - Full Stack Developer
  - Frontend & Backend Development
  - Feature Implementation
  - Testing & Optimization

Built with dedication for **MGM University**, Chhatrapati Sambhajinagar, Maharashtra.

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Security Features

- JWT-based authentication with NextAuth.js
- Password hashing with bcrypt
- Role-based route protection
- API request validation
- File type and size validation
- CSRF protection
- Secure session management

## Contributing

This is a university project developed for MGM University. For contributions or suggestions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is developed for educational purposes at MGM University.

## Contact Information

**MGM University**
- **Address**: MGM University Campus, Chhatrapati Sambhajinagar, Maharashtra, India
- **Phone**: +91 240 2982071
- **Email**: info@mgmu.ac.in
- **Website**: https://www.mgmu.ac.in/

## Acknowledgments

- MGM University for providing the opportunity
- Faculty advisors for their guidance and support
- Student community for valuable feedback
- All contributors and testers

## Future Enhancements

- Video interview scheduling
- Advanced analytics with charts and graphs
- Export data to Excel/PDF
- Multi-language support
- Mobile application
- Integration with LinkedIn
- Automated resume parsing
- Company reviews and ratings
- Student testimonials

---

**Built with ❤️ using Next.js 15, TypeScript, MongoDB, Tailwind CSS, and NextAuth.js**

© 2025 MGM University. All rights reserved.
