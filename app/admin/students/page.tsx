"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [students, searchTerm, collegeFilter, streamFilter, cgpaFilter, sortBy]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // College filter
    if (collegeFilter !== "all") {
      filtered = filtered.filter((student) => student.collegeId?._id === collegeFilter);
    }

    // Stream filter
    if (streamFilter !== "all") {
      filtered = filtered.filter((student) => student.stream === streamFilter);
    }

    // CGPA filter
    if (cgpaFilter !== "all") {
      if (cgpaFilter === "9+") {
        filtered = filtered.filter((student) => student.cgpa >= 9);
      } else if (cgpaFilter === "8-9") {
        filtered = filtered.filter((student) => student.cgpa >= 8 && student.cgpa < 9);
      } else if (cgpaFilter === "7-8") {
        filtered = filtered.filter((student) => student.cgpa >= 7 && student.cgpa < 8);
      } else if (cgpaFilter === "<7") {
        filtered = filtered.filter((student) => student.cgpa < 7);
      }
    }

    // Sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case "cgpa-high":
        filtered.sort((a, b) => b.cgpa - a.cgpa);
        break;
      case "cgpa-low":
        filtered.sort((a, b) => a.cgpa - b.cgpa);
        break;
      case "year":
        filtered.sort((a, b) => a.graduationYear - b.graduationYear);
        break;
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCollegeFilter("all");
    setStreamFilter("all");
    setCgpaFilter("all");
    setSortBy("name");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getUniqueColleges = () => {
    const colleges = students
      .map((s) => s.collegeId)
      .filter((c) => c)
      .filter((c, index, self) => self.findIndex((t) => t._id === c._id) === index);
    return colleges;
  };

  const getUniqueStreams = () => {
    return [...new Set(students.map((s) => s.stream))];
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Manage student accounts</p>
        </div>
        <Link href="/admin/students/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {getUniqueColleges().map((college) => (
                    <SelectItem key={college._id} value={college._id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={streamFilter} onValueChange={setStreamFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {getUniqueStreams().map((stream) => (
                    <SelectItem key={stream} value={stream}>
                      {stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="cgpa-high">CGPA (High to Low)</SelectItem>
                  <SelectItem value="cgpa-low">CGPA (Low to High)</SelectItem>
                  <SelectItem value="year">Graduation Year</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || collegeFilter !== "all" || streamFilter !== "all" || cgpaFilter !== "all" || sortBy !== "name") && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No students found</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Stream</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.collegeId?.name || "N/A"}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.stream}</Badge>
                    </TableCell>
                    <TableCell>{student.cgpa}</TableCell>
                    <TableCell>{student.graduationYear}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/students/edit/${student._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}