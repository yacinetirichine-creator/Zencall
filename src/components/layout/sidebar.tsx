"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bot, Phone, Calendar, Megaphone, Users, Settings, CreditCard, Plug, ChevronLeft, LogOut } from "lucide-react";
import { useUser } from "@/hooks";
import { Avatar } from "@/components/ui";
import { useI18n } from "@/i18n/provider";
import { LanguageSwitcher } from "./language-switcher";

interface SidebarProps { collapsed?: boolean; onToggle?: () => void }

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { profile, organization, signOut } = useUser();
  const { t } = useI18n();

  const navItems = [
    { label: t("dashboardNav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("dashboardNav.assistants"), href: "/dashboard/assistants", icon: Bot },
    { label: t("dashboardNav.calls"), href: "/dashboard/calls", icon: Phone },
    { label: t("dashboardNav.appointments"), href: "/dashboard/appointments", icon: Calendar },
    { label: t("dashboardNav.campaigns"), href: "/dashboard/campaigns", icon: Megaphone },
    { label: t("dashboardNav.contacts"), href: "/dashboard/contacts", icon: Users },
  ];

  const bottomItems = [
    { label: t("dashboardNav.integrations"), href: "/dashboard/integrations", icon: Plug },
    { label: t("dashboardNav.team"), href: "/dashboard/team", icon: Users },
    { label: t("dashboardNav.billing"), href: "/dashboard/billing", icon: CreditCard },
    { label: t("dashboardNav.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className={cn("fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all z-40", collapsed ? "w-16" : "w-64")}>
      <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zencall-coral-200 to-zencall-coral-300 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-800">Zencall</span>
          </Link>
        )}
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-gray-100">
          <ChevronLeft className={cn("w-5 h-5 text-gray-400 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {!collapsed && organization && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500">{t("common.organization")}</p>
          <p className="text-sm font-medium text-gray-800 truncate">{organization.name}</p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all", isActive ? "bg-zencall-coral-50 text-gray-800" : "text-gray-600 hover:bg-gray-50")}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50", pathname === item.href && "bg-gray-100 text-gray-800")}>
            <item.icon className="w-4 h-4" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {!collapsed && (
        <div className="px-3 pb-4 border-t border-gray-100">
          <div className="pt-4">
            <LanguageSwitcher showLabel />
          </div>
        </div>
      )}

      <div className="px-3 py-4 border-t border-gray-100">
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
          <Avatar src={profile?.avatar_url} fallback={profile?.full_name || profile?.email} size="sm" />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{profile?.full_name || t("common.user")}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
              </div>
              <button onClick={signOut} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
