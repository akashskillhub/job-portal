import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

export default function CollegeDashboard() {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">College Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor student placements and performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/college/students">
                <Button className="w-full">View All Students</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Placement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/college/placements">
                <Button className="w-full" variant="outline">
                  View Placements
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}