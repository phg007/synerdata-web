import ReportUnderDevelopment from "./report-under-development";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  pbUrl: string | null;
}

export default function CustomerReport({ pbUrl }: Props) {
  if (!pbUrl) return <ReportUnderDevelopment />;

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="w-full h-full">
          <Card className="w-full h-full">
            <CardContent className="p-0 w-full h-full">
              <iframe
                title="Power BI Report"
                src={pbUrl}
                width="100%"
                height="100%"
                allowFullScreen
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
