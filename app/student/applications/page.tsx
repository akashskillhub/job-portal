"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/student/applications");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "default";
      case "shortlisted":
        return "secondary";
      case "hired":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">Track your job application status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>All your submitted applications</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No applications yet. Start applying to jobs!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">
                      {app.jobId?.title || "N/A"}
                    </TableCell>
                    <TableCell>
                      {app.jobId?.companyId?.name || "N/A"}
                    </TableCell>
                    <TableCell>{formatDate(app.appliedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}