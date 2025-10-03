import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  PlusCircle,
  Users,
} from "lucide-react";

export default function CompanyDashboard() {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your job postings and applications
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <PlusCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>
                Create a new job posting to attract talented students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/company/post-job">
                <Button className="w-full">Create Job Posting</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Job Postings</CardTitle>
              <CardDescription>
                View and manage all your active job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/company/jobs">
                <Button className="w-full" variant="outline">
                  View All Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                Review and manage student applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/company/applications">
                <Button className="w-full" variant="outline">
                  View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                View analytics and hiring statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Write clear and detailed job descriptions to attract the right candidates
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Specify required skills and qualifications accurately
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Review applications promptly to show professionalism
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-sm">
                Keep candidates informed about their application status
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}