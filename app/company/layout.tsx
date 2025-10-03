import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Briefcase, FileText, PlusCircle } from "lucide-react";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "company") {
    redirect("/auth/signin?role=company");
  }

  const navItems = [
    { href: "/company/dashboard", label: "Dashboard", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/company/jobs", label: "My Jobs", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/company/applications", label: "Applications", icon: <FileText className="h-4 w-4" /> },
    { href: "/company/post-job", label: "Post Job", icon: <PlusCircle className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="Company" userName={session.user.name} navItems={navItems}>
      {children}
    </DashboardLayout>
  );
}