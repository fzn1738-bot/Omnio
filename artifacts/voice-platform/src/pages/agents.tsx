import { useListAgents, useUpdateAgent } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  PhoneCall,
  Zap,
  ScrollText,
  Filter,
  Search,
  ListChecks,
  FlaskConical,
  UserCheck,
  Rocket,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";

// Canonical ordering + iconography for the ops self-healing pipeline.
const PIPELINE: Record<string, { order: number; icon: LucideIcon; humanInLoop?: boolean }> = {
  "Log Collector": { order: 1, icon: ScrollText },
  Triage: { order: 2, icon: Filter },
  Diagnosis: { order: 3, icon: Search },
  "Fix Planner": { order: 4, icon: ListChecks },
  Validation: { order: 5, icon: FlaskConical },
  "Approval Gate": { order: 6, icon: UserCheck, humanInLoop: true },
  Executor: { order: 7, icon: Rocket },
  Verifier: { order: 8, icon: ShieldCheck },
};

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200";
    case "idle": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200";
    case "error": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200";
    case "degraded": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function AgentMonitor() {
  const { data: agents, isLoading } = useListAgents();
  const updateAgent = useUpdateAgent();
  const { company, container } = useWorkspace();

  const handleToggle = (id: number, isActive: boolean) => {
    updateAgent.mutate({ id, data: { isActive } });
  };

  const AgentCard = ({ agent }: { agent: any }) => (
    <Card className="relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full ${agent.isActive ? "bg-primary" : "bg-muted"}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
          <Switch checked={agent.isActive} onCheckedChange={(c) => handleToggle(agent.id, c)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={getStatusColor(agent.status)}>
            {agent.status}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            {agent.avgResponseMs}ms resp
          </span>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-medium">{agent.successRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${agent.successRate}%` }} />
            </div>
          </div>
          {agent.tier === "product" && (
            <div className="flex items-center justify-between pt-2 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneCall className="w-4 h-4" />
                <span>Calls Handled</span>
              </div>
              <span className="font-medium">{agent.callsHandled.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const productAgents = agents?.filter((a) => a.tier === "product") || [];
  const opsAgents = agents?.filter((a) => a.tier === "ops") || [];
  const pipeline = [...opsAgents].sort(
    (a, b) => (PIPELINE[a.name]?.order ?? 99) - (PIPELINE[b.name]?.order ?? 99),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Monitor</h1>
        <p className="text-muted-foreground">
          {company.name} · <span className="text-foreground/70">{container.name}</span> — agent performance in real time
        </p>
      </div>

      {/* Product agents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Product Agents
          <Badge variant="secondary">{productAgents.length}</Badge>
          <span className="text-sm font-normal text-muted-foreground">— the agents that earn revenue</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
            : productAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>

      {/* Ops self-healing pipeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Self-Healing Ops Pipeline
          <Badge variant="secondary">{opsAgents.length}</Badge>
          <span className="text-sm font-normal text-muted-foreground">— watch, diagnose, and repair the layer above</span>
        </h2>

        <Card>
          <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
                {pipeline.map((agent, i) => {
                  const meta = PIPELINE[agent.name];
                  const Icon = meta?.icon ?? ShieldCheck;
                  return (
                    <div key={agent.id} className="flex items-stretch">
                      <div
                        className={`flex w-36 flex-shrink-0 flex-col gap-2 rounded-lg border p-3 transition-colors ${
                          meta?.humanInLoop
                            ? "border-primary/40 bg-primary/5"
                            : "border-border bg-card hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${
                              meta?.humanInLoop ? "bg-primary/15 text-primary" : "bg-muted text-foreground/70"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              agent.status === "active"
                                ? "bg-green-500"
                                : agent.status === "error"
                                  ? "bg-red-500"
                                  : agent.status === "degraded"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight">{agent.name}</p>
                          {meta?.humanInLoop ? (
                            <p className="mt-0.5 text-[10px] font-medium text-primary">Human in the loop</p>
                          ) : (
                            <p className="mt-0.5 text-[10px] text-muted-foreground">{agent.successRate}% success</p>
                          )}
                        </div>
                      </div>
                      {i < pipeline.length - 1 && (
                        <div className="flex items-center px-0.5 text-muted-foreground/50">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval gate — human-in-the-loop checkpoint */}
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                <UserCheck className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Approval Gate · 1 pending</CardTitle>
                <p className="text-xs text-muted-foreground">Review the diagnosis, fix, validation, and blast radius before it ships.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Diagnosis</p>
                <p className="text-sm">Scheduling Agent latency spike — calendar API timeouts on <span className="font-medium">{container.name}</span>.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Proposed fix</p>
                <p className="text-sm">Raise calendar API timeout 2s → 5s and add retry with backoff.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Validation</p>
                <p className="flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Passed sandbox · 0 regressions in 142 checks
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blast radius</p>
                <p className="flex items-center gap-1.5 text-sm">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  1 container · Scheduling Agent only
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm">Approve &amp; execute</Button>
              <Button size="sm" variant="outline">Reject</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
            : opsAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>
    </div>
  );
}
