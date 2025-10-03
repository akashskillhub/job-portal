import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Building2, Briefcase, GraduationCap, CheckCircle } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin?role=admin");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Building2 className="h-4 w-4" /> },
    { href: "/admin/colleges", label: "Colleges", icon: <Building2 className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/companies", label: "Companies", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/admin/approvals", label: "Approvals", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="Admin" userName={session.user.name} navItems={navItems}>
      {children}
    </DashboardLayout>
  );
}