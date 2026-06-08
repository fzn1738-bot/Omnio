import { Layout } from "@/components/layout/Layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import CallLogs from "@/pages/calls";
import AgentMonitor from "@/pages/agents";
import Appointments from "@/pages/appointments";
import Leads from "@/pages/leads";
import FollowUps from "@/pages/follow-ups";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Dashboard /></Layout>} />
      <Route path="/calls" component={() => <Layout><CallLogs /></Layout>} />
      <Route path="/agents" component={() => <Layout><AgentMonitor /></Layout>} />
      <Route path="/scheduling" component={() => <Layout><Appointments /></Layout>} />
      <Route path="/leads" component={() => <Layout><Leads /></Layout>} />
      <Route path="/follow-ups" component={() => <Layout><FollowUps /></Layout>} />
      <Route path="/settings" component={() => <Layout><Settings /></Layout>} />
      <Route component={() => <Layout><NotFound /></Layout>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
