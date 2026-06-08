import { useListLeads, useCreateLead, getListLeadsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Mail, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const PIPELINE_COLUMNS = ['new', 'qualified', 'contacted', 'converted', 'lost'];

export default function Leads() {
  const { data: leads, isLoading } = useListLeads();
  const createLead = useCreateLead();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      value: 0,
      source: "",
      status: "new"
    }
  });

  const onSubmit = (data: any) => {
    createLead.mutate({ 
      data: {
        ...data,
        value: Number(data.value)
      } 
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Leads</h1>
          <p className="text-muted-foreground">Manage your sales pipeline and track leads</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} required /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Value ($)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Website" /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={createLead.isPending}>
                    {createLead.isPending ? "Adding..." : "Add Lead"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {PIPELINE_COLUMNS.map((status) => {
            const columnLeads = leads?.filter(l => l.status === status) || [];
            
            return (
              <div key={status} className="w-80 flex flex-col bg-muted/40 rounded-xl p-3 border border-border/50 h-full">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{status}</h3>
                  <Badge variant="secondary" className="bg-background">{columnLeads.length}</Badge>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg bg-background" />)
                  ) : (
                    columnLeads.map(lead => (
                      <Card key={lead.id} className="cursor-pointer border-transparent hover:border-primary/30 transition-all shadow-sm group">
                        <CardContent className="p-3 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm line-clamp-1 leading-tight group-hover:text-primary transition-colors">{lead.name}</h4>
                            {lead.value !== undefined && lead.value !== null && lead.value > 0 && (
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded flex items-center shrink-0">
                                <DollarSign className="w-3 h-3" />
                                {lead.value.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1.5">
                            {lead.phone && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="w-3 h-3 mr-2 text-muted-foreground/70" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center text-xs text-muted-foreground line-clamp-1">
                                <Mail className="w-3 h-3 mr-2 text-muted-foreground/70" />
                                {lead.email}
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
                            <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal border-border/50">{lead.source || 'Unknown'}</Badge>
                            <span>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
