"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await fetch("/api/college/placements");
      const data = await response.json();
      setPlacements(data.placements || []);
    } catch (error) {
      console.error("Failed to fetch placements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading placements...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Placements</h2>
        <p className="text-muted-foreground">View successful student placements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Placement Statistics</CardTitle>
          <CardDescription>
            {placements.length} student(s) successfully placed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {placements.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No placements yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Hired On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((placement, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {placement.studentName}
                    </TableCell>
                    <TableCell>{placement.studentEmail}</TableCell>
                    <TableCell>{placement.jobTitle}</TableCell>
                    <TableCell>{placement.companyName}</TableCell>
                    <TableCell>{formatDate(placement.hiredAt)}</TableCell>
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