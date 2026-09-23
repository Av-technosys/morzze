"use client";

import * as React from "react"
import Link from "@/hooks/appLink"
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Box,
  List,
  File,
  FileText,
  User,
  MessageSquare,
  Settings,
  Code,
  Feather,
  Video,
  BriefcaseBusiness,
  ShoppingCart,
  IndianRupee,
  BookOpen,
  MapPin,
  LogOut,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Products", href: "/admin/product", icon: Box },
  { label: "Orders", href: "/admin/order", icon: FileText },
  { label: "Users", href: "/admin/users", icon: User },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Payments", href: "/admin/payment", icon: IndianRupee },
  { label: "Categories", href: "/admin/category", icon: List },
  { label: "Blogs", href: "/admin/blog", icon: File },
  { label: "FAQs", href: "/admin/faq", icon: HelpCircle },
  { label: "Catalogue", href: "/admin/catalogue", icon: BookOpen },
  { label: "Stores", href: "/admin/stores", icon: MapPin },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Applications", href: "/admin/applications", icon: BriefcaseBusiness },
  { label: "Coupons", href: "/admin/coupons", icon: Code },
];

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const signOutAdmin = async () => {
    await fetch("/api/admin/access", { method: "DELETE" });
    router.replace("/admin/gate");
    router.refresh();
  };

  const currentPath = pathname.replace(/\/$/, "");

  return (
    <ShadcnSidebar variant="inset" {...props}>
      <SidebarHeader className="p-4 border-b border-zinc-800 bg-zinc-950">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-xs text-zinc-400">Manage your account details</p>
      </SidebarHeader>

      <SidebarContent className="bg-zinc-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => {
                let active = false;
                if (href === "/admin") {
                  active = currentPath === "/admin";
                } else {
                  active = currentPath === href || currentPath.startsWith(`${href}/`);
                }

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => setOpenMobile(false)}
                      className={`gap-3 ${active
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-400 font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                    >
                      <Link className=" flex gap-2 items-center w-full" href={href}>
                        <Icon size={18} className={active ? "text-yellow-400" : ""} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-zinc-800 bg-zinc-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => void signOutAdmin()}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/50 justify-center font-medium"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
