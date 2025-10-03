import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  User,
  Upload,
} from "lucide-react";

export default function StudentDashboard() {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Find your dream job and kickstart your career
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Browse Jobs</CardTitle>
              <CardDescription>
                Explore job opportunities tailored for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/jobs">
                <Button className="w-full">View Available Jobs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Applications</CardTitle>
              <CardDescription>
                Track the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/applications">
                <Button className="w-full" variant="outline">
                  View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <User className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>
                Keep your profile up-to-date for recruiters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/profile">
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Add or update your resume for applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/profile">
                <Button className="w-full" variant="outline">
                  Manage Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Complete your profile to increase visibility to recruiters
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Upload a professional resume in PDF format
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Apply early - many positions are filled on a first-come basis
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Regularly check your application status for updates
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}