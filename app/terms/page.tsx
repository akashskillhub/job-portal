import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                By accessing and using the MGM University Job Portal, you accept and agree to be bound by
                these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide false or misleading information</li>
                <li>Impersonate another person or entity</li>
                <li>Upload malicious software or content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to the platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Student Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>Students using the platform agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate academic and personal information</li>
                <li>Upload genuine documents (resume, certificates)</li>
                <li>Attend interviews and respond to company communications professionally</li>
                <li>Inform the placement office of any job offers received</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Company Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>Companies using the platform agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate job descriptions and requirements</li>
                <li>Respect student privacy and data protection laws</li>
                <li>Conduct fair and transparent recruitment processes</li>
                <li>Honor job offers made to students</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Content Ownership</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                You retain ownership of any content you upload to the platform (resumes, profiles, etc.).
                By uploading content, you grant us a license to use, store, and display it for the purpose
                of providing our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Platform Availability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                While we strive to maintain continuous availability, we do not guarantee uninterrupted
                access to the platform. We reserve the right to modify or discontinue services with or
                without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                MGM University Job Portal is provided "as is" without warranties of any kind. We are not
                liable for any damages arising from the use or inability to use the platform, including but
                not limited to job opportunities, application outcomes, or data loss.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms, engage in
                fraudulent activity, or misuse the platform. Users may also delete their accounts at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We may update these Terms of Service from time to time. Continued use of the platform after
                changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="mt-3">
                Email: legal@mgmu.ac.in<br />
                Phone: +91 240 2982071<br />
                Address: MGM University, Chhatrapati Sambhajinagar, Maharashtra, India
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
