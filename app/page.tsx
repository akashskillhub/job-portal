"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, GraduationCap, Shield, CheckCircle, ArrowRight, Zap, Target, Clock, Award, Star, Users, TrendingUp, Sparkles, Rocket, Globe, Heart, FileText, Bell, Search, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Animation */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse mx-auto">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to MGM University
            <span className="block text-primary mt-2">Job Portal</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connecting students with career opportunities through streamlined placement management
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/jobs">
              <Button size="lg" className="gap-2 group hover:scale-105 transition-transform">
                Browse Jobs
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/student-signup">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                Register as Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Choose Us with Staggered Animation */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Why Choose Our Portal?</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience a modern approach to campus placements with cutting-edge features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "AI-Powered Matching",
                description: "Smart skill-based job recommendations tailored to your profile",
                icon: Zap
              },
              {
                label: "Instant Notifications",
                description: "Real-time updates on job postings and application status",
                icon: Clock
              },
              {
                label: "Easy Application",
                description: "Apply to multiple jobs with just a few clicks",
                icon: Target
              },
              {
                label: "Quality Opportunities",
                description: "Verified companies and pre-approved job listings",
                icon: Award
              },
            ].map((benefit, index) => (
              <Card
                key={benefit.label}
                className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 border-transparent hover:border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{benefit.label}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Portal Access */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Portal Access</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Admin</CardTitle>
                <CardDescription>Manage the entire platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signin?role=admin">
                  <Button className="w-full" variant="default">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <Building2 className="w-12 h-12 text-primary mb-2" />
                <CardTitle>College</CardTitle>
                <CardDescription>View students and placements</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signin?role=college">
                  <Button className="w-full" variant="default">
                    College Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <Briefcase className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Company</CardTitle>
                <CardDescription>Post jobs and hire talent</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signin?role=company">
                  <Button className="w-full" variant="default">
                    Company Login
                  </Button>
                </Link>
                <Link href="/auth/signup?role=company">
                  <Button className="w-full mt-2" variant="outline">
                    Register Company
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <GraduationCap className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Student</CardTitle>
                <CardDescription>Find and apply for jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signin?role=student">
                  <Button className="w-full" variant="default">
                    Student Login
                  </Button>
                </Link>
                <Link href="/auth/student-signup">
                  <Button className="w-full mt-2" variant="outline">
                    Register Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Simple, efficient, and transparent placement process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2 text-lg">Register & Get Approved</h3>
                <p className="text-muted-foreground text-sm">
                  Companies register and await admin approval to ensure quality partnerships
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2 text-lg">Post Opportunities</h3>
                <p className="text-muted-foreground text-sm">
                  Approved companies post job openings with detailed requirements
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2 text-lg">Match & Apply</h3>
                <p className="text-muted-foreground text-sm">
                  Students discover relevant jobs with AI-powered matching and apply seamlessly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Smart Job Matching",
              description: "AI-powered skill matching ensures students see the most relevant opportunities",
              icon: CheckCircle,
            },
            {
              title: "Real-time Notifications",
              description: "Get instant updates on application status and new job postings",
              icon: CheckCircle,
            },
            {
              title: "Comprehensive Analytics",
              description: "Track placement metrics and student performance with detailed reports",
              icon: CheckCircle,
            },
          ].map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-16 animate-in fade-in duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Success Stories</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hear from students who found their dream jobs through our platform
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Software Engineer at Google",
                quote: "The AI-powered job matching helped me find the perfect opportunity that aligned with my skills!",
                rating: 5
              },
              {
                name: "Priya Patel",
                role: "Data Analyst at Microsoft",
                quote: "Seamless application process and instant notifications made my job search so much easier.",
                rating: 5
              },
              {
                name: "Amit Kumar",
                role: "Full Stack Developer at Amazon",
                quote: "Found my dream job within weeks! The platform connected me with top companies effortlessly.",
                rating: 5
              }
            ].map((story, index) => (
              <Card
                key={story.name}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">"{story.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">{story.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{story.name}</p>
                      <p className="text-xs text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* Call to Action */}
        <Card className="mb-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <CardContent className="py-16 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm animate-pulse">
                <Briefcase className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their dream jobs through our platform.
              Start exploring opportunities today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/jobs">
                <Button size="lg" variant="secondary" className="gap-2 hover:scale-105 transition-transform shadow-lg">
                  Explore Jobs <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/student-signup">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 border-white/30 hover:scale-105 transition-transform backdrop-blur-sm">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Platform Features with Animation */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 animate-bounce">✨ Powerful Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to streamline your placement journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Advanced Search",
                description: "Filter jobs by location, salary, skills, and more to find your perfect match"
              },
              {
                icon: Bell,
                title: "Smart Alerts",
                description: "Get instant notifications for jobs matching your profile and application updates"
              },
              {
                icon: FileText,
                title: "Resume Builder",
                description: "Create professional resumes with our integrated resume management system"
              },
              {
                icon: BarChart,
                title: "Analytics Dashboard",
                description: "Track your application progress and get insights on your job search"
              },
              {
                icon: Globe,
                title: "Multi-College Network",
                description: "Connect with opportunities across multiple colleges and universities"
              },
              {
                icon: Heart,
                title: "Save & Organize",
                description: "Bookmark favorite jobs and organize applications efficiently"
              }
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6 relative z-10">
                  <div className="mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Animated Process Flow */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary">🚀 Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Journey to Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From registration to placement, we guide you every step of the way
            </p>
          </div>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  icon: GraduationCap,
                  title: "Create Profile",
                  description: "Sign up and complete your student profile with skills and preferences"
                },
                {
                  step: "02",
                  icon: Search,
                  title: "Browse Opportunities",
                  description: "Explore AI-matched job listings from top companies"
                },
                {
                  step: "03",
                  icon: FileText,
                  title: "Apply Instantly",
                  description: "Submit applications with one click and track their status"
                },
                {
                  step: "04",
                  icon: Rocket,
                  title: "Get Hired",
                  description: "Receive offers and start your professional career"
                }
              ].map((item, index) => (
                <Card
                  key={item.step}
                  className="relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-3 border-2 hover:border-primary"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                    </div>
                    <div className="mt-8 mb-4">
                      <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">⭐ Our Commitment</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Sets Us Apart</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our innovative approach to campus placements
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform"></div>
              <CardContent className="pt-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">100% Verified Opportunities</h3>
                    <p className="text-muted-foreground">
                      Every company and job posting is verified by our admin team to ensure authenticity
                      and quality. Your safety and trust are our top priorities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform"></div>
              <CardContent className="pt-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">AI-Powered Smart Matching</h3>
                    <p className="text-muted-foreground">
                      Our intelligent algorithm matches your skills with job requirements, ensuring
                      you discover the most relevant opportunities tailored to your profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform"></div>
              <CardContent className="pt-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Real-Time Updates</h3>
                    <p className="text-muted-foreground">
                      Stay informed with instant email notifications about new job postings,
                      application status changes, and interview schedules - never miss an opportunity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform"></div>
              <CardContent className="pt-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Comprehensive Support</h3>
                    <p className="text-muted-foreground">
                      From profile creation to final placement, our dedicated support team guides
                      you through every step of your career journey with personalized assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-all hover:scale-105 duration-300 border-2 border-primary/10 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                For Companies
              </CardTitle>
              <CardDescription>
                Post jobs and find talented students from top colleges
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Link href="/auth/signup?role=company">
                <Button className="w-full group-hover:shadow-lg transition-shadow">Register Your Company</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:scale-105 duration-300 border-2 border-primary/10 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                For Students
              </CardTitle>
              <CardDescription>
                Create your profile and start applying to exciting opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Link href="/auth/student-signup">
                <Button className="w-full group-hover:shadow-lg transition-shadow">Create Student Account</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}