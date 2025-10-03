"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
  userName: string;
  navItems: Array<{ href: string; label: string; icon?: React.ReactNode }>;
}

export function DashboardLayout({
  children,
  role,
  userName,
  navItems,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">College Job Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:inline">
              {userName} ({role})
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside
          className={`
            lg:w-64 bg-white rounded-lg shadow-md p-4 space-y-2
            ${isMobileMenuOpen ? "block" : "hidden lg:block"}
          `}
        >
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-md p-6">
          {children}
        </main>
      </div>
    </div>
  );
}