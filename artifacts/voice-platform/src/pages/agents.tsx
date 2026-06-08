import { useListAgents, useUpdateAgent } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Activity, PhoneCall, Zap, AlertTriangle } from "lucide-react";

export default function AgentMonitor() {
  const { data: agents, isLoading } = useListAgents();
  const updateAgent = useUpdateAgent();

  const handleToggle = (id: number, isActive: boolean) => {
    updateAgent.mutate({ id, data: { isActive } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200';
      case 'idle': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const AgentCard = ({ agent }: { agent: any }) => (
    <Card className="relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full ${agent.isActive ? 'bg-primary' : 'bg-muted'}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
          <Switch 
            checked={agent.isActive} 
            onCheckedChange={(c) => handleToggle(agent.id, c)} 
          />
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
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${agent.successRate}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneCall className="w-4 h-4" />
              <span>Calls Handled</span>
            </div>
            <span className="font-medium">{agent.callsHandled.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const productAgents = agents?.filter(a => a.tier === 'product') || [];
  const opsAgents = agents?.filter(a => a.tier === 'ops') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Monitor</h1>
        <p className="text-muted-foreground">Manage and monitor AI agent performance in real-time</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Product Agents
          <Badge variant="secondary">{productAgents.length}</Badge>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
          ) : (
            productAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Ops Agents
          <Badge variant="secondary">{opsAgents.length}</Badge>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
          ) : (
            opsAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)
          )}
        </div>
      </div>
    </div>
  );
}
