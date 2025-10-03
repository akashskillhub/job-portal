"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    minCGPA: 7.0,
    applicationDeadline: "",
    skills: "",
    allowedStreams: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/company/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map(s => s.trim()),
          allowedStreams: formData.allowedStreams.split(",").map(s => s.trim()),
          allowedColleges: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      toast({
        title: "Success",
        description: "Job posted successfully",
      });

      router.push("/company/jobs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Post a New Job</h2>
        <p className="text-muted-foreground">Create a job posting to attract candidates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the details for your job posting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <select
                  id="jobType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minCGPA">Minimum CGPA *</Label>
                <Input
                  id="minCGPA"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.minCGPA}
                  onChange={(e) => setFormData({ ...formData, minCGPA: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  required
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills (comma-separated) *</Label>
                <Input
                  id="skills"
                  required
                  placeholder="JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allowedStreams">Allowed Streams (comma-separated) *</Label>
                <Input
                  id="allowedStreams"
                  required
                  placeholder="Computer Science, Information Technology"
                  value={formData.allowedStreams}
                  onChange={(e) => setFormData({ ...formData, allowedStreams: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Job Description *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Job"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/company/jobs")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}