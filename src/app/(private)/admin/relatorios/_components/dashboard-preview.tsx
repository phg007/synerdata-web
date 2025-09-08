"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface DashboardPreviewProps {
  powerBiLink: string;
}

export function DashboardPreview({ powerBiLink }: DashboardPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle>Preview do Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-4">
        {powerBiLink ? (
          <iframe
            title="Power BI Dashboard"
            src={powerBiLink}
            className="w-full border-0 rounded-md"
            style={{
              border: "none",
              height: "calc(100% + 100px)",
              marginTop: "-15px",
              marginBottom: "-30px",
            }}
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-gray-50 rounded-md">
            <BarChart2 className="h-12 w-12 mb-4" />
            <p className="font-medium">Nenhum dashboard selecionado</p>
            <p className="text-sm">
              Selecione uma empresa e salve o link para ver o preview.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
