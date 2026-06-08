import { useListCalls } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneIncoming, PhoneOutgoing, Clock, User, Hash, FileText } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function CallLogs() {
  const { data: calls, isLoading } = useListCalls();
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  const selectedCall = calls?.find(c => c.id === selectedCallId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'missed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
        <p className="text-muted-foreground">View and analyze all inbound and outbound calls</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : calls?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No calls found.
                  </TableCell>
                </TableRow>
              ) : (
                calls?.map((call) => (
                  <TableRow 
                    key={call.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedCallId(call.id)}
                  >
                    <TableCell>
                      <div className="font-medium">{call.callerName || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{call.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {call.direction === 'inbound' ? (
                          <PhoneIncoming className="w-4 h-4 text-blue-500" />
                        ) : (
                          <PhoneOutgoing className="w-4 h-4 text-green-500" />
                        )}
                        <span className="capitalize">{call.direction}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(call.status)}>
                        {call.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal capitalize">{call.outcome || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      {call.sentiment !== undefined && call.sentiment !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2 max-w-[60px]">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${call.sentiment * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{(call.sentiment * 100).toFixed(0)}%</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(call.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Drawer open={!!selectedCallId} onOpenChange={(open) => !open && setSelectedCallId(null)}>
        <DrawerContent className="max-w-3xl mx-auto h-[85vh]">
          {selectedCall && (
            <>
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DrawerTitle className="text-2xl flex items-center gap-3">
                      {selectedCall.direction === 'inbound' ? <PhoneIncoming className="text-blue-500" /> : <PhoneOutgoing className="text-green-500" />}
                      Call with {selectedCall.callerName || "Unknown"}
                    </DrawerTitle>
                    <DrawerDescription className="mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {selectedCall.phone}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedCall.createdAt).toLocaleString()}</span>
                    </DrawerDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedCall.status)}>
                    {selectedCall.status.replace('_', ' ')}
                  </Badge>
                </div>
              </DrawerHeader>
              <div className="p-4 px-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Duration</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{selectedCall.duration ? `${Math.floor(selectedCall.duration / 60)}m ${selectedCall.duration % 60}s` : '-'}</p></CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sentiment</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{selectedCall.sentiment ? `${(selectedCall.sentiment * 100).toFixed(0)}%` : '-'}</p></CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Agent Type</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold capitalize">{selectedCall.agentType || '-'}</p></CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base"><FileText className="w-4 h-4" /> AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedCall.summary || "No summary available for this call."}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Call Outcome</h4>
                  <Badge variant="secondary" className="px-3 py-1 text-sm capitalize">{selectedCall.outcome || "Not categorized"}</Badge>
                </div>
              </div>
              <DrawerFooter className="border-t">
                <DrawerClose asChild>
                  <Button variant="outline">Close Details</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
