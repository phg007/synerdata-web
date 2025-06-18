import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container max-w-7xl py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-white hover:text-white/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Synerdata
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 py-8 bg-[#2A0F55] text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="font-bold text-xl">Synerdata</span>
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Synerdata. Todos os direitos
              reservados.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/70 hover:text-white transition-colors"
            >
              Termos
            </Link>
            <Link
              href="/politica-privacidade"
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
