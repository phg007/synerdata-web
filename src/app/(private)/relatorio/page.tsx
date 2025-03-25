"use client";

import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="w-full h-full">
            <Card className="w-full h-full">
              <CardContent className="p-0 w-full h-full">
                <iframe
                  title="Power BI Report"
                  width="100%"
                  height="100%"
                  src="https://app.powerbi.com/view?r=eyJrIjoiZTk1ZTY4MmQtYjdmMi00YWQyLWE2MTUtYzgzM2ZhNTQwNjBiIiwidCI6ImY1NzczNDE4LWViZjctNGZiNi1iYWEwLTdiNGUyNWYxZTE5NCJ9"
                  allowFullScreen={true}
                  style={{ border: "none" }}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
