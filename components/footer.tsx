import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/mgm-logo.svg"
                alt="MGM University Logo"
                className="h-16 w-auto object-contain"
              />
              <div>
                <div className="text-lg font-bold text-primary">MGM University</div>
                <div className="text-xs text-muted-foreground">Job Portal</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students with career opportunities through streamlined placement management.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Portal Access</h3>
            <ul className="space-y-2 text-sm">
              {/* <li>
                <Link href="/auth/signin?role=student" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signin?role=company" className="text-muted-foreground hover:text-primary transition-colors">
                  Company Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signin?role=college" className="text-muted-foreground hover:text-primary transition-colors">
                  College Login
                </Link>
              </li> */}
              <li>
                <Link href="/auth/signin?role=admin" className="text-muted-foreground hover:text-primary transition-colors font-semibold">
                  Admin Login
                </Link>
              </li>
              {/* <li>
                <Link href="/auth/student-signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Registration
                </Link>
              </li> */}
              {/* <li>
                <Link href="/auth/signup?role=company" className="text-muted-foreground hover:text-primary transition-colors">
                  Company Registration
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  MGM University Campus,<br />
                  Chh. Sambhajinagar,<br />
                  Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+91 240 2982071</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@mgmu.ac.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} MGM University. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Designed and Developed by <span className="font-semibold text-primary">Sakshi Markal</span> & <span className="font-semibold text-primary">Pratiksha Shinde</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
