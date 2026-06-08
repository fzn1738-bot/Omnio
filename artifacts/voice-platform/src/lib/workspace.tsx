import { createContext, useContext, useMemo, useState } from "react";

/**
 * A "container" is a deployable configuration of the Omnio agent stack for one
 * of a company's solutions (e.g. a front-desk line vs. an after-hours line, or
 * a production vs. staging build). Switching containers re-scopes the whole app.
 */
export type Container = {
  id: string;
  name: string;
  env: "production" | "staging" | "sandbox";
  segment: string;
};

export type Company = {
  id: string;
  name: string;
  segment: string;
  containers: Container[];
};

export const COMPANIES: Company[] = [
  {
    id: "northside-dental",
    name: "Northside Dental",
    segment: "Healthcare",
    containers: [
      { id: "nd-frontdesk", name: "Front Desk", env: "production", segment: "Scheduling + Pre-screening" },
      { id: "nd-afterhours", name: "After Hours", env: "production", segment: "Triage + Follow-ups" },
      { id: "nd-staging", name: "Front Desk (Staging)", env: "staging", segment: "Scheduling + Pre-screening" },
    ],
  },
  {
    id: "apex-auto",
    name: "Apex Auto Group",
    segment: "Automotive",
    containers: [
      { id: "aa-service", name: "Service Bay", env: "production", segment: "Inventory + Quotes" },
      { id: "aa-sales", name: "Sales Line", env: "production", segment: "Leads + Follow-ups" },
      { id: "aa-sandbox", name: "Sales Line (Sandbox)", env: "sandbox", segment: "Leads + Follow-ups" },
    ],
  },
  {
    id: "meridian-home",
    name: "Meridian Home Services",
    segment: "Field Services",
    containers: [
      { id: "mh-dispatch", name: "Dispatch", env: "production", segment: "Scheduling + Routing" },
      { id: "mh-quotes", name: "Quotes Desk", env: "staging", segment: "Pricing + Quotes" },
    ],
  },
];

type WorkspaceValue = {
  companies: Company[];
  company: Company;
  container: Container;
  setCompanyId: (id: string) => void;
  setContainerId: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyIdState] = useState(COMPANIES[0].id);
  const company = COMPANIES.find((c) => c.id === companyId) ?? COMPANIES[0];

  const [containerId, setContainerId] = useState(company.containers[0].id);
  const container =
    company.containers.find((c) => c.id === containerId) ?? company.containers[0];

  // Switching company resets to that company's first container.
  const setCompanyId = (id: string) => {
    setCompanyIdState(id);
    const next = COMPANIES.find((c) => c.id === id) ?? COMPANIES[0];
    setContainerId(next.containers[0].id);
  };

  const value = useMemo<WorkspaceValue>(
    () => ({ companies: COMPANIES, company, container, setCompanyId, setContainerId }),
    [company, container],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
