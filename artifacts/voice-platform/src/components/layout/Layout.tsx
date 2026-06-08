import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, Calendar as CalendarIcon, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search calls, leads, or agents..." 
          className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-white transition-all h-9"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-muted transition-colors">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Today
        </div>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
        </Button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 py-1 px-2 rounded-md transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
            OW
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Opus Workspace</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
