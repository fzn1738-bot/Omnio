import { useListAppointments, useCreateAppointment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAppointmentsQueryKey } from "@workspace/api-client-react";

export default function Appointments() {
  const { data: appointments, isLoading } = useListAppointments();
  const createAppointment = useCreateAppointment();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      contactName: "",
      phone: "",
      serviceType: "",
      scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration: 30
    }
  });

  const onSubmit = (data: any) => {
    createAppointment.mutate({ 
      data: {
        ...data,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        duration: Number(data.duration)
      } 
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      case 'no_show': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage scheduled appointments and calls</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl><Input {...field} required /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input {...field} required /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl><Input {...field} required placeholder="e.g. Discovery Call" /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} required /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (min)</FormLabel>
                        <FormControl><Input type="number" {...field} required /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={createAppointment.isPending}>
                    {createAppointment.isPending ? "Scheduling..." : "Schedule"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
        ) : appointments?.length === 0 ? (
          <div className="col-span-full p-12 text-center border rounded-xl border-dashed bg-muted/20">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No appointments scheduled</h3>
            <p className="text-sm text-muted-foreground mt-1">Create an appointment to get started.</p>
          </div>
        ) : (
          appointments?.map((apt) => (
            <Card key={apt.id} className="hover:border-primary/50 transition-colors group cursor-pointer">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold line-clamp-1">{apt.serviceType}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <User className="w-3 h-3 mr-1.5" />
                    <span className="truncate">{apt.contactName}</span>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(apt.status)}>
                  {apt.status.replace('_', ' ')}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm mt-1 bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {format(new Date(apt.scheduledAt), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-muted-foreground ml-6">
                    <Clock className="w-3.5 h-3.5 mr-2" />
                    {format(new Date(apt.scheduledAt), 'h:mm a')}
                    {apt.duration && <span className="ml-1 opacity-70">({apt.duration}m)</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
