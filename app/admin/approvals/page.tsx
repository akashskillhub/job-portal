"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApprovalsPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    try {
      const response = await fetch("/api/admin/companies?filter=pending");
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Failed to fetch pending companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/companies/${id}/approve`, {
        method: "PATCH",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Company approved successfully",
        });
        fetchPendingCompanies();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve company",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this company?")) return;

    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Company rejected",
        });
        fetchPendingCompanies();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject company",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pending approvals...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
        <p className="text-muted-foreground">Review and approve company registrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies Awaiting Approval</CardTitle>
          <CardDescription>
            {companies.length} company(ies) waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No pending approvals
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.size}</TableCell>
                    <TableCell>
                      {company.city}, {company.state}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(company._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(company._id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
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