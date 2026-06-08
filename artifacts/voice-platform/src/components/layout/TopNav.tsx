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
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-sm transition-all hover:text-foreground hover:shadow-md active:translate-y-px";

export function TopNav() {
  const [location, navigate] = useLocation();
  const isAdmin = USER.role === "admin";
  const roleRing = isAdmin
    ? "ring-blue-500/40 text-blue-600 dark:text-blue-400"
    : "ring-emerald-500/40 text-emerald-600 dark:text-emerald-400";

  return (
    <header className="ribbon sticky top-0 z-30 border-b border-border/70">
      {/* Tier 1 — centered brand, icon-only utilities on the right */}
      <div className="relative flex h-16 items-center justify-center px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <OmnioMark size={32} />
          <span className="text-2xl font-bold tracking-tight">Omnio</span>
        </Link>

        <div className="absolute right-4 flex items-center gap-1.5 lg:right-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn(iconBtn, "relative")}>
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/settings")}
                className={cn(iconBtn, location === "/settings" && "border-primary/40 bg-primary/10 text-primary")}
              >
                <Settings className="h-[18px] w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className={iconBtn}>
                <LifeBuoy className="h-[18px] w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Help &amp; Support</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm ring-2 transition-all hover:shadow-md active:translate-y-px", roleRing)}>
                <UserCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {USER.name} · {isAdmin ? "Admin" : "User"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Tier 2 — centered primary navigation */}
      <nav className="flex items-center justify-center gap-1 overflow-x-auto px-2 lg:px-4">
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
      </nav>

      {/* Tier 3 — workspace switchers (left) + search (right) on one row */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-1 lg:px-6">
        <WorkspaceSwitcher />
        <div className="relative ml-auto w-full max-w-md">
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
