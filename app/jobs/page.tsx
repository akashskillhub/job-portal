"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Briefcase, MapPin, Calendar, Building2, Search, Filter, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  skills: string[];
  minCGPA: number;
  applicationDeadline: string;
  salary?: { min: number; max: number; currency: string };
  companyId: { name: string; industry: string; city: string };
}

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs/public");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    // Sort by newest
    filtered.sort((a, b) => new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime());

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setJobTypeFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-8">Loading jobs...</div>
        </div>
      </div>
    );
  }

  // Get unique locations and job types
  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location)));
  const uniqueJobTypes = Array.from(new Set(jobs.map((job) => job.jobType)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Available Jobs</h2>
            <p className="text-muted-foreground">Browse and discover job opportunities</p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Location Filter */}
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Job Type Filter */}
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueJobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No jobs available at the moment</p>
                <Link href="/auth/student-signup">
                  <Button>Register as Student</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card key={job._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle>{job.title}</CardTitle>
                          <Badge>{job.jobType}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {job.companyId.name} • {job.companyId.industry}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {formatDate(job.applicationDeadline)}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Min CGPA: {job.minCGPA}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {job.salary && (
                      <p className="text-sm font-medium">
                        Salary: {formatCurrency(job.salary.min, job.salary.currency)} -{" "}
                        {formatCurrency(job.salary.max, job.salary.currency)}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Link href="/auth/signin?role=student" className="flex-1">
                        <Button className="w-full">Apply Now</Button>
                      </Link>
                      <Link href="/auth/student-signup">
                        <Button variant="outline">Register</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {filteredJobs.length > 0 && (
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
                <p className="mb-4 opacity-90">Sign in or register to apply for these opportunities</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/auth/signin?role=student">
                    <Button variant="secondary" size="lg">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/auth/student-signup">
                    <Button variant="secondary" size="lg">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
