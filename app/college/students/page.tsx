"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

export default function CollegeStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [students, searchTerm, streamFilter, yearFilter, cgpaFilter, sortBy]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/college/students");
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
      filtered = filtered.filter((student) => {
        const name = `${student.firstName} ${student.lastName}`.toLowerCase();
        return (
          name.includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Stream filter
    if (streamFilter !== "all") {
      filtered = filtered.filter((student) => student.stream === streamFilter);
    }

    // Graduation year filter
    if (yearFilter !== "all") {
      filtered = filtered.filter((student) => student.graduationYear.toString() === yearFilter);
    }

    // CGPA filter
    if (cgpaFilter !== "all") {
      filtered = filtered.filter((student) => {
        const cgpa = student.cgpa;
        switch (cgpaFilter) {
          case "9+":
            return cgpa >= 9;
          case "8-9":
            return cgpa >= 8 && cgpa < 9;
          case "7-8":
            return cgpa >= 7 && cgpa < 8;
          case "below7":
            return cgpa < 7;
          default:
            return true;
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case "cgpa":
        filtered.sort((a, b) => b.cgpa - a.cgpa);
        break;
      case "year":
        filtered.sort((a, b) => a.graduationYear - b.graduationYear);
        break;
      case "rollNumber":
        filtered.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
        break;
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStreamFilter("all");
    setYearFilter("all");
    setCgpaFilter("all");
    setSortBy("name");
    setCurrentPage(1);
  };

  const getUniqueStreams = () => {
    return [...new Set(students.map((s) => s.stream))];
  };

  const getUniqueYears = () => {
    return [...new Set(students.map((s) => s.graduationYear))].sort();
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">View all students from your college</p>
        </div>
        <Link href="/college/students/create">
          <Button style={{ backgroundColor: "#800000" }} className="hover:bg-[#600000]">
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
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={streamFilter} onValueChange={setStreamFilter}>
                <SelectTrigger className="w-full lg:w-[150px]">
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
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full lg:w-[130px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {getUniqueYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
                <SelectTrigger className="w-full lg:w-[130px]">
                  <SelectValue placeholder="CGPA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CGPA</SelectItem>
                  <SelectItem value="9+">9.0+</SelectItem>
                  <SelectItem value="8-9">8.0 - 9.0</SelectItem>
                  <SelectItem value="7-8">7.0 - 8.0</SelectItem>
                  <SelectItem value="below7">Below 7.0</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="cgpa">CGPA (High to Low)</SelectItem>
                  <SelectItem value="year">Graduation Year</SelectItem>
                  <SelectItem value="rollNumber">Roll Number</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || streamFilter !== "all" || yearFilter !== "all" || cgpaFilter !== "all" || sortBy !== "name") && (
                <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
                  <X className="h-4 w-4 mr-2" />
                  Clear
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
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Stream</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Graduation Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.stream}</Badge>
                      </TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>{student.graduationYear}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
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