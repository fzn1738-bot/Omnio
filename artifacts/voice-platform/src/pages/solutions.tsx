import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Boxes, Layers, Puzzle } from "lucide-react";
import { useWorkspace, type SolutionPack } from "@/lib/workspace";

function PackRow({ pack, onToggle }: { pack: SolutionPack; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
      <div>
        <p className="text-sm font-medium">{pack.name}</p>
        <p className="text-xs text-muted-foreground">{pack.description}</p>
      </div>
      <Switch checked={pack.enabled} onCheckedChange={onToggle} />
    </div>
  );
}

export default function Solutions() {
  const { company, vertical, container, solutionPacks, togglePack } = useWorkspace();

  const core = solutionPacks.filter((p) => p.category === "core");
  const niche = solutionPacks.filter((p) => p.category === "niche");
  const enabledCount = solutionPacks.filter((p) => p.enabled).length;
  const VerticalIcon = vertical.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Solution Packs</h1>
        <p className="text-muted-foreground">
          {company.name} · <span className="text-foreground/70">{container.name}</span> — capabilities configured for this container
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm">
          <Boxes className="h-4 w-4 text-primary" />
          Container: <span className="font-medium">{container.name}</span>
        </span>
        <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm">
          <VerticalIcon className="h-4 w-4 text-muted-foreground" />
          Vertical: <span className="font-medium">{vertical.name}</span>
        </span>
        <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm">
          <Badge variant="secondary">{enabledCount}</Badge> packs enabled
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>Core</CardTitle>
            </div>
            <CardDescription>Standard capabilities available on every Omnio solution.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {core.map((pack) => (
              <PackRow key={pack.id} pack={pack} onToggle={() => togglePack(pack.id)} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-primary" />
              <CardTitle>Niche — {vertical.name}</CardTitle>
            </div>
            <CardDescription>Segment-specific integrations like pre-screening, prior auth, and inventory sync.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {niche.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No niche packs on this container.</p>
            ) : (
              niche.map((pack) => (
                <PackRow key={pack.id} pack={pack} onToggle={() => togglePack(pack.id)} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
