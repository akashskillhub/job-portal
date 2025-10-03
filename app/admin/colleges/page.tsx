"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

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
          <CardTitle>All Colleges</CardTitle>
        </CardHeader>
        <CardContent>
          {colleges.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No colleges found</p>
          ) : (
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
                {colleges.map((college) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}