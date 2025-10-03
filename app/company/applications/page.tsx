"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Eye, FileText, Phone, Mail, GraduationCap, Award, X } from "lucide-react";

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, statusFilter, cgpaFilter, streamFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/company/applications");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // CGPA filter
    if (cgpaFilter !== "all") {
      if (cgpaFilter === "9+") {
        filtered = filtered.filter((app) => app.studentId?.cgpa >= 9);
      } else if (cgpaFilter === "8-9") {
        filtered = filtered.filter((app) => app.studentId?.cgpa >= 8 && app.studentId?.cgpa < 9);
      } else if (cgpaFilter === "7-8") {
        filtered = filtered.filter((app) => app.studentId?.cgpa >= 7 && app.studentId?.cgpa < 8);
      } else if (cgpaFilter === "<7") {
        filtered = filtered.filter((app) => app.studentId?.cgpa < 7);
      }
    }

    // Stream filter
    if (streamFilter !== "all") {
      filtered = filtered.filter((app) => app.studentId?.stream === streamFilter);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
        break;
      case "cgpa-high":
        filtered.sort((a, b) => (b.studentId?.cgpa || 0) - (a.studentId?.cgpa || 0));
        break;
      case "cgpa-low":
        filtered.sort((a, b) => (a.studentId?.cgpa || 0) - (b.studentId?.cgpa || 0));
        break;
    }

    setFilteredApplications(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setCgpaFilter("all");
    setStreamFilter("all");
    setSortBy("newest");
  };

  const getUniqueStreams = () => {
    return [...new Set(applications.map((app) => app.studentId?.stream).filter(Boolean))];
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/company/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application status updated",
        });
        fetchApplications();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
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

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <p className="text-muted-foreground">Review and manage job applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>
            {applications.length} total application(s) received
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="CGPA Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CGPA</SelectItem>
                  <SelectItem value="9+">9.0 and above</SelectItem>
                  <SelectItem value="8-9">8.0 - 8.9</SelectItem>
                  <SelectItem value="7-8">7.0 - 7.9</SelectItem>
                  <SelectItem value="<7">Below 7.0</SelectItem>
                </SelectContent>
              </Select>

              <Select value={streamFilter} onValueChange={setStreamFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {getUniqueStreams().map((stream) => (
                    <SelectItem key={stream} value={stream!}>
                      {stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="cgpa-high">CGPA (High to Low)</SelectItem>
                  <SelectItem value="cgpa-low">CGPA (Low to High)</SelectItem>
                </SelectContent>
              </Select>

              {(statusFilter !== "all" || cgpaFilter !== "all" || streamFilter !== "all" || sortBy !== "newest") && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No applications found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">
                      {app.studentId?.firstName} {app.studentId?.lastName}
                    </TableCell>
                    <TableCell>{app.studentId?.email}</TableCell>
                    <TableCell>{app.jobId?.title}</TableCell>
                    <TableCell>{app.studentId?.cgpa}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{app.studentId?.stream}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(app.appliedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app._id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(app.studentId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete profile and resume information
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm font-medium">Name</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-lg">{selectedStudent.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-lg">{selectedStudent.phone || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">CGPA</span>
                  </div>
                  <p className="text-lg font-semibold">{selectedStudent.cgpa}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Stream</span>
                  <div>
                    <Badge variant="secondary" className="text-sm">
                      {selectedStudent.stream}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Graduation Year</span>
                  <p className="text-lg">{selectedStudent.graduationYear || "N/A"}</p>
                </div>
              </div>

              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="space-y-3">
                  <span className="text-sm font-medium text-muted-foreground">Resume</span>
                  {selectedStudent.resumeUrl ? (
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Student Resume</p>
                          <p className="text-sm text-muted-foreground">PDF Document</p>
                        </div>
                      </div>
                      <a
                        href={selectedStudent.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          Download Resume
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-muted-foreground">No resume uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}