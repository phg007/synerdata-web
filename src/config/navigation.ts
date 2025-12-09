import {
  Home,
  Users,
  Building2,
  Building,
  Briefcase,
  DollarSign,
  IdCard,
  Shield,
  UserCog,
  FolderOpen,
  FileText,
  CircleAlert,
  AlertTriangle,
  Scale,
  Fingerprint,
  FileTextIcon,
  ShieldCheck,
  Clock,
  Palmtree,
  TrendingUp,
  UserX,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavSubItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  adminOnly?: boolean;
  items?: NavSubItem[];
};

export const navigationConfig: NavItem[] = [
  {
    title: "Dashboard",
    url: "/relatorio",
    icon: Home,
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
  },
  {
    title: "Funcionários",
    url: "/funcionarios",
    icon: Users,
    isActive: true,
  },
  {
    title: "Empresa",
    url: "#",
    icon: Building2,
    items: [
      { title: "Filiais", url: "/empresas/filiais", icon: Building },
      { title: "Setores", url: "/empresas/setores", icon: Briefcase },
      {
        title: "Centros de Custo",
        url: "/empresas/centros-de-custo",
        icon: DollarSign,
      },
      { title: "CBOs", url: "/empresas/cbos", icon: IdCard },
      { title: "EPIs", url: "/empresas/epis", icon: Shield },
      { title: "Funções", url: "/empresas/funcoes", icon: UserCog },
      { title: "Projetos", url: "/empresas/projetos", icon: FolderOpen },
    ],
  },
  {
    title: "Ocorrências",
    url: "#",
    icon: FileText,
    items: [
      {
        title: "Advertências",
        url: "/ocorrencias/advertencias",
        icon: CircleAlert,
      },
      {
        title: "Acidentes",
        url: "/ocorrencias/acidentes",
        icon: AlertTriangle,
      },
      {
        title: "Ações Trabalhistas",
        url: "/ocorrencias/acoes-trabalhistas",
        icon: Scale,
      },
      {
        title: "Análise CPF",
        url: "/ocorrencias/analises-de-cpf",
        icon: Fingerprint,
      },
      {
        title: "Atestados Médicos",
        url: "/ocorrencias/atestados",
        icon: FileTextIcon,
      },
      {
        title: "Entregas de EPIs",
        url: "/ocorrencias/entregas-de-epis",
        icon: ShieldCheck,
      },
      { title: "Faltas", url: "/ocorrencias/faltas", icon: Clock },
      { title: "Férias", url: "/ocorrencias/ferias", icon: Palmtree },
      { title: "Promoções", url: "/ocorrencias/promocoes", icon: TrendingUp },
      { title: "Rescisões", url: "/ocorrencias/rescisoes", icon: UserX },
    ],
  },
];

export const adminNavigationConfig: NavItem[] = [
  {
    title: "Empresas",
    url: "/admin/empresas",
    icon: Building,
    adminOnly: true,
  },
  {
    title: "Relatórios",
    url: "/admin/relatorios",
    icon: LayoutDashboard,
    adminOnly: true,
  },
];

export const secondaryNavigationConfig: NavItem[] = [
  {
    title: "Configurações",
    url: "/configuracoes/conta",
    icon: Settings,
  },
];
