"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [colleges, searchTerm, stateFilter, cityFilter, sortBy]);

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/admin/colleges");
      const data = await response.json();
      setColleges(data.colleges || []);
    } catch (error) {
      console.error("Failed to fetch colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...colleges];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (stateFilter !== "all") {
      filtered = filtered.filter((college) => college.state === stateFilter);
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((college) => college.city === cityFilter);
    }

    // Sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "year":
        filtered.sort((a, b) => a.establishedYear - b.establishedYear);
        break;
      case "city":
        filtered.sort((a, b) => a.city.localeCompare(b.city));
        break;
    }

    setFilteredColleges(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStateFilter("all");
    setCityFilter("all");
    setSortBy("name");
    setCurrentPage(1);
  };

  const getUniqueStates = () => {
    return [...new Set(colleges.map((c) => c.state))];
  };

  const getUniqueCities = () => {
    return [...new Set(colleges.map((c) => c.city))];
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;

    try {
      const response = await fetch(`/api/admin/colleges/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchColleges();
      }
    } catch (error) {
      console.error("Failed to delete college:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentColleges = filteredColleges.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div className="text-center py-8">Loading colleges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Colleges</h2>
          <p className="text-muted-foreground">Manage college accounts</p>
        </div>
        <Link href="/admin/colleges/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Colleges ({filteredColleges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {getUniqueStates().map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {getUniqueCities().map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="year">Established Year</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || stateFilter !== "all" || cityFilter !== "all" || sortBy !== "name") && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {filteredColleges.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No colleges found</p>
          ) : (
            <>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Est. Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentColleges.map((college) => (
                  <TableRow key={college._id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>{college.email}</TableCell>
                    <TableCell>{college.city}</TableCell>
                    <TableCell>{college.state}</TableCell>
                    <TableCell>{college.phone}</TableCell>
                    <TableCell>{college.establishedYear}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(college._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredColleges.length)} of {filteredColleges.length} colleges
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