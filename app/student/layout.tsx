import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Briefcase, FileText, User } from "lucide-react";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/auth/signin?role=student");
  }

  const navItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/student/jobs", label: "Browse Jobs", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/student/applications", label: "My Applications", icon: <FileText className="h-4 w-4" /> },
    { href: "/student/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="Student" userName={session.user.name} navItems={navItems}>
      {children}
    </DashboardLayout>
  );
}