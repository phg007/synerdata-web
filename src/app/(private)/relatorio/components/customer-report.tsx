import ReportUnderDevelopment from "./report-under-development";

interface Props {
  pbUrl: string | null;
}

export default function CustomerReportCSSHide({ pbUrl }: Props) {
  if (!pbUrl) return <ReportUnderDevelopment />;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <iframe
        title="Power BI Report"
        src={pbUrl}
        className="w-full border-0"
        style={{
          border: "none",
          height: "calc(100% + 60px)",
          marginTop: "-2px",
          marginBottom: "-30px",
        }}
        allowFullScreen
      />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white pointer-events-none" />
    </div>
  );
}
