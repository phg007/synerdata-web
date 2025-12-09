"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigationConfig, adminNavigationConfig } from "@/config/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.funcao === "SUPER_ADMIN";

  // Combinar navegação baseado no role do usuário
  const navItems = isAdmin ? adminNavigationConfig : navigationConfig;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/relatorio">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image
                    src="/synnerdata-logo.png"
                    alt="Synnerdata"
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold">Synnerdata</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        {/* <NavSecondary items={secondaryNavigationConfig} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Usuário",
            email: user?.email || "",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
