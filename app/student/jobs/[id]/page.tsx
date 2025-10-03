"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Briefcase, MapPin, Calendar, Building2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/student/jobs`);
      const data = await response.json();
      const foundJob = data.jobs?.find((j: any) => j._id === params.id);
      setJob(foundJob);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await fetch("/api/student/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: params.id,
          coverLetter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply");
      }

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });

      router.push("/student/applications");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center py-8">Job not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{job.title}</h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-2">
          <Building2 className="h-4 w-4" />
          {job.companyId.name} • {job.companyId.industry}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Job Type</p>
                <Badge>{job.jobType}</Badge>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Salary Range</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(job.salary.min, job.salary.currency)} -{" "}
                    {formatCurrency(job.salary.max, job.salary.currency)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Application Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(job.applicationDeadline)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Minimum CGPA</p>
              <p className="text-sm text-muted-foreground">{job.minCGPA}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apply for this Position</CardTitle>
          <CardDescription>
            Submit your application with a cover letter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <textarea
              id="coverLetter"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Tell us why you're interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Submit Application"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}