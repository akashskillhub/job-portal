"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Jobs", href: "/jobs" },
    { name: "Contact", href: "/contact" },
  ];

  const loginOptions = [
    { name: "Student Login", href: "/auth/signin?role=student", icon: GraduationCap },
    { name: "Company Login", href: "/auth/signin?role=company", icon: Briefcase },
    { name: "College Login", href: "/auth/signin?role=college", icon: Building2 },
    // { name: "Admin Login", href: "/auth/signin?role=admin", icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/mgm-logo.svg"
              alt="MGM University Logo"
              className="h-16 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-lg font-bold leading-tight text-primary">
                MGM University
              </div>
              <div className="text-xs text-muted-foreground">
                Job Portal
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Theme Toggle & Login */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Login Dropdown - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="gap-1">
                    <User className="h-4 w-4" />
                    Login
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {loginOptions.map((option) => (
                    <DropdownMenuItem key={option.name} asChild>
                      <Link
                        href={option.href}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <option.icon className="h-4 w-4" />
                        {option.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Login Options */}
            <div className="border-t pt-4 space-y-2">
              <div className="px-4 text-xs font-semibold text-muted-foreground uppercase">
                Login As
              </div>
              {loginOptions.map((option) => (
                <Link
                  key={option.name}
                  href={option.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <option.icon className="h-4 w-4" />
                  {option.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
