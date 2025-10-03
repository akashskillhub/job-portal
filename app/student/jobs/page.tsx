"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Briefcase, MapPin, Calendar, Building2, Search, Filter } from "lucide-react";
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
  matchScore?: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSkills, setStudentSkills] = useState<string[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match"); // Default to match score

  useEffect(() => {
    fetchProfile();
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, sortBy, studentSkills]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/student/profile");
      const data = await response.json();
      setStudentSkills(data.student?.skills || []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/student/jobs");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (jobSkills: string[]): number => {
    if (!studentSkills || studentSkills.length === 0 || !jobSkills || jobSkills.length === 0) {
      return 0;
    }

    const studentSkillsLower = studentSkills.map(s => s.toLowerCase());
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    const matchingSkillsCount = jobSkillsLower.filter(skill =>
      studentSkillsLower.some(studentSkill =>
        studentSkill.includes(skill) || skill.includes(studentSkill)
      )
    ).length;

    return Math.round((matchingSkillsCount / jobSkillsLower.length) * 100);
  };

  const applyFilters = () => {
    let filtered = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job.skills)
    }));

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

    // Sorting
    if (sortBy === "match") {
      filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime());
    } else if (sortBy === "salary-high") {
      filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
    } else if (sortBy === "salary-low") {
      filtered.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setJobTypeFilter("all");
    setSortBy("newest");
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  // Get unique locations and job types
  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location)));
  const uniqueJobTypes = Array.from(new Set(jobs.map((job) => job.jobType)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Available Jobs</h2>
        <p className="text-muted-foreground">Browse and apply to job opportunities</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
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
            <p className="text-muted-foreground">No jobs available at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{job.title}</CardTitle>
                      {job.matchScore && job.matchScore >= 70 && (
                        <Badge className="bg-green-500">
                          Highly Recommended
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {job.companyId.name} • {job.companyId.industry}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge>{job.jobType}</Badge>
                    {job.matchScore !== undefined && job.matchScore > 0 && (
                      <Badge
                        variant={job.matchScore >= 70 ? "default" : job.matchScore >= 40 ? "secondary" : "outline"}
                        className={job.matchScore >= 70 ? "bg-green-600" : job.matchScore >= 40 ? "bg-blue-600 text-white" : ""}
                      >
                        {job.matchScore}% Match
                      </Badge>
                    )}
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

                <p className="text-sm text-muted-foreground">
                  Minimum CGPA: {job.minCGPA}
                </p>

                <Link href={`/student/jobs/${job._id}`}>
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}