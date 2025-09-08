"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Users,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
  Building,
  Briefcase,
  Settings,
  DollarSign,
  IdCard,
  UserCog,
  UserX,
  AlertTriangle,
  Clock,
  FileTextIcon,
  Fingerprint,
  Palmtree,
  Scale,
  ShieldCheck,
  TrendingUp,
  FolderOpen,
  Shield,
  CircleAlert,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/relatorio" },
  { id: "users", label: "Usuários", icon: Users, path: "/usuarios" },
  {
    id: "companies",
    label: "Empresas",
    icon: Building,
    path: "/admin/empresas",
    adminOnly: true,
  },
  {
    id: "companies-dasboards",
    label: "Relatórios",
    icon: LayoutDashboard,
    path: "/admin/relatorios",
    adminOnly: true,
  },
  {
    id: "employees",
    label: "Funcionários",
    icon: Users,
    path: "/funcionarios",
  },
  {
    id: "company",
    label: "Empresa",
    icon: Building2,
    path: "/empresas",
    submenu: [
      {
        id: "company-branches",
        label: "Filiais",
        icon: Building,
        path: "/empresas/filiais",
      },
      {
        id: "company-departments",
        label: "Setores",
        icon: Briefcase,
        path: "/empresas/setores",
      },
      {
        id: "company-costCenters",
        label: "Centros de Custo",
        icon: DollarSign,
        path: "/empresas/centros-de-custo",
      },
      {
        id: "company-cbos",
        label: "Cbos",
        icon: IdCard,
        path: "/empresas/cbos",
      },
      {
        id: "company-epis",
        label: "Epis",
        icon: Shield,
        path: "/empresas/epis",
      },
      {
        id: "company-roles",
        label: "Funções",
        icon: UserCog,
        path: "/empresas/funcoes",
      },
      {
        id: "company-projects",
        label: "Projetos",
        icon: FolderOpen,
        path: "/empresas/projetos",
      },
    ],
  },
  {
    id: "occurrences",
    label: "Ocorrências",
    icon: FileText,
    path: "/ocorrencias",
    submenu: [
      {
        id: "occurrences-warnings",
        label: "Advertências",
        icon: CircleAlert,
        path: "/ocorrencias/advertencias",
      },
      {
        id: "occurrences-accidents",
        label: "Acidentes",
        icon: AlertTriangle,
        path: "/ocorrencias/acidentes",
      },
      {
        id: "occurrences-labor-actions",
        label: "Ações Trabalhistas",
        icon: Scale,
        path: "/ocorrencias/acoes-trabalhistas",
      },
      {
        id: "occurrences-cpf-analysis",
        label: "Análise CPF",
        icon: Fingerprint,
        path: "/ocorrencias/analises-de-cpf",
      },
      {
        id: "occurrences-medical-certificates",
        label: "Atestados Médicos",
        icon: FileTextIcon,
        path: "/ocorrencias/atestados",
      },
      {
        id: "occurrences-epi-deliveries",
        label: "Entregas de EPIs",
        icon: ShieldCheck,
        path: "/ocorrencias/entregas-de-epis",
      },
      {
        id: "occurrences-absences",
        label: "Faltas",
        icon: Clock,
        path: "/ocorrencias/faltas",
      },
      {
        id: "occurrences-vacations",
        label: "Férias",
        icon: Palmtree,
        path: "/ocorrencias/ferias",
      },
      {
        id: "occurrences-promotions",
        label: "Promoções",
        icon: TrendingUp,
        path: "/ocorrencias/promocoes",
      },

      {
        id: "occurrences-terminations",
        label: "Rescisões",
        icon: UserX,
        path: "/ocorrencias/rescisoes",
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const menu = menuItems.find(
      (item) =>
        pathname === item.path ||
        item.submenu?.some((sub) => pathname === sub.path)
    );
    setActiveMenu(menu?.id || null);
  }, [pathname, isMounted]);

  const logout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col bg-gray-100">
      <header className="bg-[#340D64] text-white shadow z-50">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8">Synnerdata</h1>

            <nav className="flex space-x-2">
              {menuItems
                .filter((item) => {
                  if (user?.funcao === "SUPER_ADMIN") {
                    return item.adminOnly === true;
                  } else {
                    return item.adminOnly !== true;
                  }
                })
                .map((item) => {
                  if (item.submenu) {
                    return (
                      <div key={item.id} className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`text-white ${
                                activeMenu === item.id
                                  ? "bg-white/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.label}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#340D64] border-white/10 text-white">
                            {item.submenu.map((sub) => (
                              <DropdownMenuItem key={sub.id} asChild>
                                <Link
                                  href={sub.path}
                                  className={`flex items-center w-full ${
                                    pathname === sub.path ? "bg-white/10" : ""
                                  }`}
                                >
                                  <sub.icon className="mr-2 h-4 w-4" />
                                  {sub.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  } else {
                    return (
                      <div key={item.id} className="relative">
                        <Link href={item.path}>
                          <Button
                            variant="ghost"
                            className={`text-white ${
                              pathname === item.path
                                ? "bg-white/10"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      </div>
                    );
                  }
                })}
            </nav>
          </div>

          {status === "loading" ? (
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white px-3 py-2">
                  <div className="flex flex-col text-left mr-2">
                    <span className="text-xs">{user?.name}</span>
                    <span className="text-xs text-slate-300">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {user?.funcao !== "SUPER_ADMIN" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/configuracoes/conta"
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configurações da Conta
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </div>
  );
}
