import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { GraduationCap, TrendingUp, Users } from "lucide-react";

export default async function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "college") {
    redirect("/auth/signin?role=college");
  }

  const navItems = [
    { href: "/college/dashboard", label: "Dashboard", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/college/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/college/placements", label: "Placements", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="College" userName={session.user.name} navItems={navItems}>
      {children}
    </DashboardLayout>
  );
}