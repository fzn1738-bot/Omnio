import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Phone,
  Bot,
  Calendar,
  Users,
  MessageSquare,
  Boxes,
  Settings,
  LifeBuoy,
  Bell,
  Search,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { OmnioMark } from "@/components/OmnioLogo";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calls", label: "Call Logs", icon: Phone },
  { href: "/agents", label: "Agent Monitor", icon: Bot },
  { href: "/scheduling", label: "Appointments", icon: Calendar },
  { href: "/leads", label: "Sales Leads", icon: Users },
  { href: "/follow-ups", label: "Follow-ups", icon: MessageSquare },
  { href: "/solutions", label: "Solutions", icon: Boxes },
];

// Current signed-in user (mock). Admins render in blue, regular users in green.
const USER = { name: "Opus Workspace", role: "admin" as "admin" | "user" };

export function TopNav() {
  const [location] = useLocation();
  const roleColor = USER.role === "admin" ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400";
  const roleRing = USER.role === "admin" ? "ring-blue-500/30 text-blue-600 dark:text-blue-400" : "ring-emerald-500/30 text-emerald-600 dark:text-emerald-400";

  return (
    <header className="ribbon sticky top-0 z-30 border-b border-border/70">
      {/* Tier 1 — workspace switchers (left), brand (center), notifications (right) */}
      <div className="relative flex h-16 items-center px-4 lg:px-6">
        <div className="flex items-center">
          <WorkspaceSwitcher />
        </div>

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5"
        >
          <OmnioMark size={32} />
          <span className="text-2xl font-bold tracking-tight">Omnio</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm transition-all hover:text-foreground hover:shadow-md active:translate-y-px">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </button>
        </div>
      </div>

      {/* Tier 2 — primary navigation (left), settings / help / user (right) */}
      <nav className="flex items-center gap-1 px-2 lg:px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1 pl-2">
          <Link href="/settings">
            <div
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                location === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </div>
          </Link>
          <button className="flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground">
            <LifeBuoy className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button
            title={`${USER.name} · ${USER.role === "admin" ? "Admin" : "User"}`}
            className={cn(
              "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-all hover:bg-muted/70",
            )}
          >
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-sm ring-2", roleRing)}>
              <UserCircle className="h-5 w-5" />
            </span>
            <span className={cn("hidden text-xs font-semibold sm:inline", roleColor)}>
              {USER.role === "admin" ? "Admin" : "User"}
            </span>
          </button>
        </div>
      </nav>

      {/* Tier 3 — search, on its own row */}
      <div className="px-4 pb-3 pt-1 lg:px-6">
        <div className="relative w-full max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calls, leads, agents, appointments..."
            className="h-10 rounded-full border-border/60 bg-card pl-10 shadow-sm transition-all focus-visible:shadow-md focus-visible:ring-1"
          />
        </div>
      </div>
    </header>
  );
}
