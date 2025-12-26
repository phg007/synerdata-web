import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientLayout from "./client-layout";
// Para ativar proteção contra scripts maliciosos, descomente:
// import { SecurityGuard } from "@/components/security-guard";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Synnerdata - Transforme seus dados em insights estratégicos",
  description:
    "Centralize, analise e tome decisões baseadas em dados com nossa plataforma integrada de gestão empresarial e Power BI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Para ativar proteção contra scripts maliciosos, descomente: */}
        {/* <SecurityGuard /> */}
        <ClientLayout>{children}</ClientLayout>
        <Toaster richColors />
      </body>
    </html>
  );
}
