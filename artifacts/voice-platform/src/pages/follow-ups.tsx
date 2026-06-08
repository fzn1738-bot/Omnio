import { useListFollowUps, useUpdateFollowUp, getListFollowUpsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Phone, Mail, Clock, Check } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function FollowUps() {
  const { data: followUps, isLoading } = useListFollowUps();
  const updateFollowUp = useUpdateFollowUp();
  const queryClient = useQueryClient();

  const getChannelIcon = (channel?: string) => {
    switch(channel) {
      case 'sms': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'call': return <Phone className="w-4 h-4 text-green-500" />;
      case 'email': return <Mail className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200">Pending</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200">Failed</Badge>;
      case 'sent': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">Sent</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkComplete = (id: number) => {
    updateFollowUp.mutate({ id, data: { status: 'completed', completedAt: new Date().toISOString() } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFollowUpsQueryKey() })
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground">Automated nurture and follow-up communications</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : followUps?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No follow-ups scheduled.
                  </TableCell>
                </TableRow>
              ) : (
                followUps?.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6">
                      <div className="font-medium text-foreground/90">{item.contactName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.phone || item.message || "No message"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize font-normal text-xs">
                        {item.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getChannelIcon(item.channel)}
                        <span className="capitalize">{item.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground/70" />
                        {format(new Date(item.scheduledAt), 'MMM d, h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {item.status === 'pending' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleMarkComplete(item.id)}
                          disabled={updateFollowUp.isPending}
                        >
                          <Check className="w-4 h-4 mr-1.5" />
                          Mark Done
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground mr-3">
                          {item.completedAt ? format(new Date(item.completedAt), 'MMM d') : '-'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
