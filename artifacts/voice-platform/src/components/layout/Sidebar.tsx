import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Phone,
  Bot,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calls", label: "Call Logs", icon: Phone },
  { href: "/agents", label: "Agent Monitor", icon: Bot },
  { href: "/scheduling", label: "Appointments", icon: Calendar },
  { href: "/leads", label: "Sales Leads", icon: Users },
  { href: "/follow-ups", label: "Follow-ups", icon: MessageSquare },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const [location] = useLocation();

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen sticky top-0 border-r border-sidebar-border relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
        {!collapsed && <span className="font-semibold text-lg tracking-tight truncate text-white">VoiceOps AI</span>}
        {collapsed && <span className="font-semibold text-lg text-primary mx-auto">V</span>}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-sidebar-border text-sidebar-foreground border border-sidebar-border rounded-full p-1 hover:text-primary transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="w-full">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  size={18}
                  className={cn("flex-shrink-0", isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80")}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border flex flex-col gap-1 px-2">
        <Link href="/settings" className="w-full">
          <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group",
              location === "/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}>
            <Settings size={18} className="flex-shrink-0 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80" />
            {!collapsed && <span className="truncate">Settings</span>}
          </div>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground mt-1">
          <LifeBuoy size={18} className="flex-shrink-0 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80" />
          {!collapsed && <span className="truncate">Help & Support</span>}
        </div>
      </div>
    </aside>
  );
}
