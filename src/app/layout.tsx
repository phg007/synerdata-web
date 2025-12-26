import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientLayout from "./client-layout";
import { SecurityGuard } from "@/components/security-guard";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Synnerdata - Transforme seus dados em insights estratégicos",
  description:
    "Centralize, analise e tome decisões baseadas em dados com nossa plataforma integrada de gestão empresarial e Power BI.",
  other: {
    referrer: "strict-origin-when-cross-origin",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        {/* Fallback CSP via meta tag (frame-ancestors and X-Frame-Options only work via HTTP headers) */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://viacep.com.br https://*.uploadthing.com https://api.synnerdata.com.br; form-action 'self'; base-uri 'self';"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <SecurityGuard />
        <ClientLayout>{children}</ClientLayout>
        <Toaster richColors />
      </body>
    </html>
  );
}
