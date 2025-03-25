"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "sonner";

// Define menu items
const menuItems = [
  {
    id: "dashboard",
    label: "Relatório",
    icon: LayoutDashboard,
    path: "/relatorio",
  },
  { id: "users", label: "Usuários", icon: Users, path: "/usuarios" },
  {
    id: "employees",
    label: "Funcionários",
    icon: Users,
    path: "/funcionarios",
  },
  { id: "company", label: "Empresa", icon: Building2, path: "/empresas" },
  {
    id: "occurrences",
    label: "Ocorrências",
    icon: FileText,
    path: "/ocorrencias",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();

  // Set active menu based on current path when component mounts
  useEffect(() => {
    const currentMenuItem = menuItems.find((item) =>
      pathname.includes(item.path)
    );
    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.id);
    }
  }, [pathname]);

  // Add scrollbar styling
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

  const handleMenuClick = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    router.push(path);
  };

  const handleLogout = () => {
    router.push("/login");
  };

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
                <User className="h-4 w-4 mr-1" />
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
      <main className="flex-1 p-4 overflow-auto">{children}</main>
      <Toaster />
    </div>
  );
}
