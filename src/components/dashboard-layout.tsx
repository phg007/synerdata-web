"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
  Building,
  Home,
  Briefcase,
  Shield,
  Layers,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

// Define menu item type
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

// Define menu items
const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/relatorio" },
  { id: "users", label: "Usuários", icon: Users, path: "/usuarios" },
  {
    id: "employees",
    label: "Funcionários",
    icon: Users,
    path: "/funcionarios",
    submenu: [
      {
        id: "employees-main",
        label: "Funcionários",
        icon: Users,
        path: "/funcionarios",
      },

      {
        id: "employees-epis",
        label: "EPIs",
        icon: Shield,
        path: "/funcionarios/epis",
      },
      {
        id: "employees-roles",
        label: "Cargos",
        icon: Layers,
        path: "/funcionarios/roles",
      },
    ],
  },
  {
    id: "company",
    label: "Empresa",
    icon: Building2,
    path: "/company",
    submenu: [
      {
        id: "company-main",
        label: "Empresa",
        icon: Building2,
        path: "/empresas",
      },
      {
        id: "company-branches",
        label: "Filiais",
        icon: Building,
        path: "empresas/filiais",
      },
      {
        id: "employees-sector",
        label: "Setores",
        icon: Briefcase,
        path: "/empresas/setores",
      },
    ],
  },
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

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.ReactElement {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    const currentMenuItem = menuItems.find(
      (item) =>
        pathname === item.path ||
        (item.submenu &&
          item.submenu.some((subItem) => pathname === subItem.path))
    );

    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.id);

      if (currentMenuItem.submenu) {
        const currentSubmenuItem = currentMenuItem.submenu.find(
          (subItem) => pathname === subItem.path
        );
        if (currentSubmenuItem) {
          setActiveSubmenu(currentSubmenuItem.id);
        }
      }
    }
  }, [pathname]);

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

  const handleMenuClick = (menuId: string, path: string): void => {
    const menuItem = menuItems.find((item) => item.id === menuId);

    if (menuItem?.submenu) {
      setIsSubmenuOpen((prev) => ({
        ...prev,
        [menuId]: !prev[menuId],
      }));

      if (path) {
        setActiveMenu(menuId);
        router.push(path);
      }
    } else {
      setActiveMenu(menuId);
      router.push(path);
    }
  };

  const handleSubmenuClick = (
    menuId: string,
    submenuId: string,
    path: string
  ): void => {
    setActiveMenu(menuId);
    setActiveSubmenu(submenuId);
    router.push(path);
  };

  async function logout() {
    await signOut({
      redirect: false,
    });

    router.replace("/");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation bar */}
      <header className="bg-[#340D64] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Synerdata</h1>
            <nav className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.submenu ? (
                    <DropdownMenu
                      open={isSubmenuOpen[item.id]}
                      onOpenChange={(open) =>
                        setIsSubmenuOpen((prev) => ({
                          ...prev,
                          [item.id]: open,
                        }))
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`text-white ${activeMenu === item.id ? "bg-white/10" : "hover:bg-white/5"}`}
                          onClick={() => handleMenuClick(item.id, item.path)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${isSubmenuOpen[item.id] ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-56 bg-[#340D64] border-white/10"
                      >
                        {item.submenu.map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.id}
                            className={`text-white hover:bg-white/10 ${activeSubmenu === subItem.id ? "bg-white/10" : ""}`}
                            onClick={() =>
                              handleSubmenuClick(
                                item.id,
                                subItem.id,
                                subItem.path
                              )
                            }
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`text-white ${activeMenu === item.id ? "bg-white/10" : "hover:bg-white/5"}`}
                      onClick={() => handleMenuClick(item.id, item.path)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </div>
          {status === "loading" ? (
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="hidden md:flex flex-col space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 px-3 py-2 h-auto text-white"
                >
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-medium">{user?.name}</span>
                    <span className="text-xs text-slate-300">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    {user?.empresa && (
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">Empresa:</span>{" "}
                        {user?.empresa}
                      </p>
                    )}
                    {user?.empresa && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">Plano:</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {"Plano"}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/configuracoes/conta"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações da Conta</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center cursor-pointer text-red-600 focus:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Breadcrumb navigation for submenu context */}
      {activeSubmenu &&
        (activeMenu === "employees" || activeMenu === "company") && (
          <div className="bg-white border-b px-4 py-2">
            <div className="container mx-auto">
              <nav className="flex text-sm">
                <Link
                  href={activeMenu === "employees" ? "/employees" : "/company"}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {activeMenu === "employees" ? "Funcionários" : "Empresa"}
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-900 font-medium">
                  {
                    menuItems
                      .find((item) => item.id === activeMenu)
                      ?.submenu?.find((subItem) => subItem.id === activeSubmenu)
                      ?.label
                  }
                </span>
              </nav>
            </div>
          </div>
        )}

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  );
}
