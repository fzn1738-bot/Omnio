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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const SECONDARY_ITEMS = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TopNav() {
  const [location] = useLocation();

  return (
    <header className="ribbon sticky top-0 z-30 border-b border-border/70">
      {/* Tier 1 — brand, workspace switcher, utilities */}
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <OmnioMark size={30} />
          <span className="text-xl font-bold tracking-tight">Omnio</span>
        </Link>

        <div className="mx-1 hidden h-7 w-px bg-border sm:block" />

        <WorkspaceSwitcher />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden w-64 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search calls, leads, agents..."
              className="h-9 border-transparent bg-muted/60 pl-9 transition-all focus-visible:bg-background focus-visible:ring-1"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>

          <div className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-muted/60 sm:px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              OW
            </div>
            <div className="hidden flex-col leading-none lg:flex">
              <span className="text-sm font-medium">Opus Workspace</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2 — primary navigation ribbon */}
      <nav className="flex items-center gap-1 overflow-x-auto px-2 lg:px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-2 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30",
                  )}
                />
              </div>
            </Link>
          );
        })}

        <div className="ml-auto flex items-center gap-1">
          {SECONDARY_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              </Link>
            );
          })}
          <div className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
            <LifeBuoy className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
