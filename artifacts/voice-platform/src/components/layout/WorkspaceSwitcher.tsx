import { Building2, Boxes, Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useWorkspace, companiesByVertical, type Container } from "@/lib/workspace";

const ENV_STYLES: Record<Container["env"], string> = {
  production: "bg-primary/10 text-primary",
  staging: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  sandbox: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
};

function EnvBadge({ env }: { env: Container["env"] }) {
  return (
    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", ENV_STYLES[env])}>
      {env}
    </span>
  );
}

export function WorkspaceSwitcher() {
  const { company, vertical, container, setCompanyId, setContainerId } = useWorkspace();
  const groups = companiesByVertical();
  const VerticalIcon = vertical.icon;

  return (
    <div className="flex items-center gap-1.5">
      {/* Company segregation, grouped & sorted by business vertical */}
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <VerticalIcon className="h-3 w-3" />
              {vertical.name}
            </span>
            <span className="max-w-[12rem] truncate text-sm font-semibold">{company.name}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {groups.map((group, i) => {
            const GIcon = group.vertical.icon;
            return (
              <div key={group.vertical.id}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded", group.vertical.accent)}>
                    <GIcon className="h-3 w-3" />
                  </span>
                  {group.vertical.name}
                </DropdownMenuLabel>
                {group.companies.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setCompanyId(c.id)}
                    className="flex items-center justify-between gap-2 pl-3"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.containers.length} container{c.containers.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    {c.id === company.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="text-muted-foreground/40">/</span>

      {/* Container / configuration switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground/70">
            <Boxes className="h-4 w-4" />
          </span>
          <span className="hidden flex-col leading-tight md:flex">
            <span className="text-[11px] text-muted-foreground">Container</span>
            <span className="max-w-[12rem] truncate text-sm font-semibold">{container.name}</span>
          </span>
          <EnvBadge env={container.env} />
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>Containers · {company.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {company.containers.map((ct) => (
            <DropdownMenuItem
              key={ct.id}
              onClick={() => setContainerId(ct.id)}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex flex-col">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {ct.name}
                  <EnvBadge env={ct.env} />
                </span>
                <span className="text-xs text-muted-foreground">{ct.segment}</span>
              </span>
              {ct.id === container.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
