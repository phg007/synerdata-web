"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Toaster } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active menu based on current path
  const getActiveMenu = useCallback(() => {
    if (pathname === "/painel") return "painel";
    if (pathname === "/painel/users") return "users";
    if (pathname === "/painel/employees") return "employees";
    if (pathname === "/painel/company") return "company";
    if (pathname === "/painel/occurrences") return "occurrences";
    return "painel";
  }, [pathname]);

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  // Update active menu when pathname changes
  useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [pathname, getActiveMenu]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .overflow-x-auto::-webkit-scrollbar {
        height: 10px;
      }
      .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }
      .overflow-x-auto::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = useCallback(() => {
    router.push("/login");
  }, [router]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/painel",
    },
    {
      id: "users",
      label: "Usuários",
      icon: Users,
      path: "/painel/usuarios",
    },
    {
      id: "employees",
      label: "Funcionários",
      icon: Users,
      path: "/painel/funcionarios",
    },
    {
      id: "company",
      label: "Empresa",
      icon: Building2,
      path: "/painel/empresas",
    },
    {
      id: "occurrences",
      label: "Ocorrências",
      icon: FileText,
      path: "/painel/ocorrencias",
    },
  ];

  const handleMenuClick = useCallback(
    (menuId: string, path: string) => {
      setActiveMenu(menuId);
      router.push(path);
    },
    [router]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation bar */}
      <header className="bg-[#340D64] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Synerdata</h1>
            <nav className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`text-white ${activeMenu === item.id ? "bg-white/10" : "hover:bg-white/5"}`}
                  onClick={() => handleMenuClick(item.id, item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                Usuário
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 bg-[#340D64]">{children}</main>
      <Toaster />
    </div>
  );
}
