"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Building2, Briefcase, FileCheck, Award } from "lucide-react";

const COLORS = ["#800000", "#A0522D", "#CD5C5C", "#DC143C", "#B22222", "#8B0000"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">Failed to load analytics</div>;
  }

  // Prepare data for charts
  const statusData = analytics.applicationStatusDist?.map((item: any) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
  })) || [];

  const streamData = analytics.streamDistribution?.map((item: any) => ({
    name: item._id,
    students: item.count,
  })) || [];

  const companyData = analytics.topCompaniesByJobs?.map((item: any) => ({
    name: item.companyName,
    jobs: item.jobCount,
  })) || [];

  const placementData = analytics.placementsPerCollege?.map((item: any) => ({
    name: item.collegeName,
    placements: item.placements,
  })) || [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendData = analytics.monthlyTrend?.map((item: any) => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    applications: item.count,
  })) || [];

  const stats = [
    {
      title: "Total Students",
      value: analytics.totalStudents || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Companies",
      value: analytics.totalCompanies || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Jobs",
      value: analytics.totalJobs || 0,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Applications",
      value: analytics.totalApplications || 0,
      icon: FileCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Placements",
      value: analytics.totalPlacements || 0,
      icon: Award,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending Approvals",
      value: analytics.pendingApprovals || 0,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive overview of placement statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Overview of all application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Stream-wise Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Stream-wise Student Distribution</CardTitle>
            <CardDescription>Number of students per stream</CardDescription>
          </CardHeader>
          <CardContent>
            {streamData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={streamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#800000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Companies by Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Job Postings</CardTitle>
            <CardDescription>Companies with most job listings</CardDescription>
          </CardHeader>
          <CardContent>
            {companyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs" fill="#CD5C5C" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* College-wise Placements */}
        <Card>
          <CardHeader>
            <CardTitle>College-wise Placements</CardTitle>
            <CardDescription>Number of placements per college</CardDescription>
          </CardHeader>
          <CardContent>
            {placementData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placements" fill="#A0522D" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No placements yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Trend */}
      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Trend (Last 6 Months)</CardTitle>
            <CardDescription>Monthly application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#800000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
