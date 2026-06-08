import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetDashboardSummary, useGetCallStats, useListAlerts, useListActivity, useDismissAlert, useListCalls } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, Clock, DollarSign, X, Phone, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useWorkspace } from "@/lib/workspace";
import { scaleMetric, scopeList } from "@/lib/scope";

function MetricCard({ title, value, subValue, icon: Icon, isLoading }: any) {
  return (
    <Card className="overflow-hidden relative group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {subValue && (
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">{subValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary({ days: 7 });
  const { data: stats, isLoading: isLoadingStats } = useGetCallStats({ days: 7 });
  const { data: alerts, isLoading: isLoadingAlerts } = useListAlerts();
  const { data: activities, isLoading: isLoadingActivity } = useListActivity({ limit: 10 });
  const { data: recentCalls, isLoading: isLoadingCalls } = useListCalls({ limit: 5 });
  const dismissAlert = useDismissAlert();
  const { company, container } = useWorkspace();

  // Scope the shared API data to the selected container (see lib/scope.ts).
  const scopedSummary = useMemo(
    () =>
      summary && {
        ...summary,
        revenueOnHours: scaleMetric(summary.revenueOnHours, container),
        revenueAfterHours: scaleMetric(summary.revenueAfterHours, container),
        timeSavedMinutes: scaleMetric(summary.timeSavedMinutes, container),
      },
    [summary, container],
  );
  const scopedStats = useMemo(
    () =>
      stats && {
        ...stats,
        callsByDay: stats.callsByDay.map((d) => ({
          ...d,
          inbound: scaleMetric(d.inbound, container),
          outbound: scaleMetric(d.outbound, container),
        })),
        callTypes: stats.callTypes.map((t) => ({ ...t, count: scaleMetric(t.count, container) })),
        dropOffReasons: stats.dropOffReasons.map((r) => ({ ...r, count: scaleMetric(r.count, container) })),
      },
    [stats, container],
  );
  const scopedAlerts = useMemo(() => alerts && scopeList(alerts, container, (a) => a.id), [alerts, container]);
  const scopedActivities = useMemo(
    () => activities && scopeList(activities, container, (a) => a.id),
    [activities, container],
  );
  const scopedCalls = useMemo(
    () => recentCalls && scopeList(recentCalls, container, (c) => c.id),
    [recentCalls, container],
  );

  const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {company.name} · <span className="text-foreground/70">{container.name}</span> — voice AI operations overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Last 7 days</Button>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Revenue (On Hours)"
          value={scopedSummary ? `$${scopedSummary.revenueOnHours.toLocaleString()}` : "$0"}
          icon={DollarSign}
          isLoading={isLoadingSummary}
        />
        <MetricCard
          title="Revenue (After Hours)"
          value={scopedSummary ? `$${scopedSummary.revenueAfterHours.toLocaleString()}` : "$0"}
          icon={DollarSign}
          isLoading={isLoadingSummary}
        />
        <MetricCard
          title="Avg Sentiment"
          value={scopedSummary ? `${(scopedSummary.sentimentScore * 100).toFixed(0)}%` : "0%"}
          icon={Activity}
          isLoading={isLoadingSummary}
        />
        <MetricCard
          title="Time Saved"
          value={scopedSummary ? `${Math.round(scopedSummary.timeSavedMinutes / 60)} hrs` : "0 hrs"}
          icon={Clock}
          isLoading={isLoadingSummary}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scopedStats?.callsByDay || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                      <Area type="monotone" dataKey="inbound" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorInbound)" />
                      <Area type="monotone" dataKey="outbound" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorOutbound)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Types</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scopedStats?.callTypes || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="label"
                        >
                          {(scopedStats?.callTypes || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drop-off Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scopedStats?.dropOffReasons || []} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                        <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Featured Calls</CardTitle>
                <CardDescription>Recent high-value interactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/calls">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingCalls ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {scopedCalls?.map(call => (
                    <div key={call.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{call.callerName || "Unknown Caller"}</p>
                          <p className="text-xs text-muted-foreground">{call.phone} • {call.duration ? `${Math.floor(call.duration/60)}m ${call.duration%60}s` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={call.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20' : ''}>
                          {call.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{call.sentiment ? `${(call.sentiment * 100).toFixed(0)}%` : '-'}</p>
                          <p className="text-xs text-muted-foreground">Sentiment</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {isLoadingAlerts ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border-b last:border-0"><Skeleton className="h-12 w-full" /></div>
                  ))
                ) : scopedAlerts?.filter(a => !a.dismissed).length === 0 ? (
                  <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                    <span className="text-muted-foreground text-sm font-medium">All systems normal</span>
                  </div>
                ) : (
                  scopedAlerts?.filter(a => !a.dismissed).map(alert => (
                    <div key={alert.id} className="p-4 border-b last:border-0 flex items-start gap-3 hover:bg-muted/50 transition-colors group">
                      <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        alert.severity === 'critical' ? 'text-destructive' : 
                        alert.severity === 'warning' ? 'text-chart-5' : 'text-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => dismissAlert.mutate({ id: alert.id })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col max-h-[400px] overflow-y-auto">
                {isLoadingActivity ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border-b last:border-0"><Skeleton className="h-8 w-full" /></div>
                  ))
                ) : scopedActivities?.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No recent activity</div>
                ) : (
                  scopedActivities?.map(activity => (
                    <div key={activity.id} className="p-4 border-b border-border/50 last:border-0 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 ring-4 ring-primary/10"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/90 leading-tight mb-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
