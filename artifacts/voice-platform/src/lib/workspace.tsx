import { createContext, useContext, useMemo, useState } from "react";
import {
  Stethoscope,
  Car,
  Wrench,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Business verticals — the top-level segments that companies are organized and
 * sorted into. Each company belongs to exactly one vertical.
 */
export type Vertical = {
  id: string;
  name: string;
  icon: LucideIcon;
  /** Tailwind classes for the vertical's accent chip. */
  accent: string;
};

export const VERTICALS: Vertical[] = [
  { id: "healthcare", name: "Healthcare", icon: Stethoscope, accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "automotive", name: "Automotive", icon: Car, accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  { id: "field-services", name: "Home & Field Services", icon: Wrench, accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { id: "professional", name: "Professional Services", icon: Scale, accent: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  { id: "wellness", name: "Hospitality & Wellness", icon: Sparkles, accent: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
];

/**
 * A solution pack is a toggleable capability module configured on a container.
 * "core" packs ship on every solution; "niche" packs are vertical-specific.
 */
export type SolutionPack = {
  id: string;
  name: string;
  description: string;
  category: "core" | "niche";
  enabled: boolean;
};

const corePacks = (overrides: Partial<Record<string, boolean>> = {}): SolutionPack[] => [
  { id: "scheduling", name: "Scheduling", description: "Book, reschedule, and cancel against live calendars", category: "core", enabled: overrides.scheduling ?? true },
  { id: "followups", name: "Follow-ups", description: "Lead nurture, confirmations, reviews, and upsells", category: "core", enabled: overrides.followups ?? true },
  { id: "knowledge", name: "Knowledge Base", description: "Answer from your business info, FAQs, and policies", category: "core", enabled: overrides.knowledge ?? true },
  { id: "crm", name: "CRM Sync", description: "Read and write customer history and preferences", category: "core", enabled: overrides.crm ?? true },
];

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
  solutionPacks: SolutionPack[];
};

export type Company = {
  id: string;
  name: string;
  verticalId: string;
  containers: Container[];
};

const RAW_COMPANIES: Company[] = [
  // Healthcare
  {
    id: "northside-dental",
    name: "Northside Dental",
    verticalId: "healthcare",
    containers: [
      {
        id: "nd-frontdesk", name: "Front Desk", env: "production", segment: "Scheduling + Pre-screening",
        solutionPacks: [
          ...corePacks(),
          { id: "prescreen", name: "Pre-screening", description: "Collect symptoms and intake before booking", category: "niche", enabled: true },
          { id: "priorauth", name: "Prior Authorization", description: "Check and initiate insurance prior auths", category: "niche", enabled: true },
          { id: "insurance", name: "Insurance Verification", description: "Verify coverage and eligibility on the call", category: "niche", enabled: false },
        ],
      },
      {
        id: "nd-afterhours", name: "After Hours", env: "production", segment: "Triage + Follow-ups",
        solutionPacks: [
          ...corePacks({ scheduling: false }),
          { id: "triage", name: "Symptom Triage", description: "Route urgent cases to on-call staff", category: "niche", enabled: true },
        ],
      },
      { id: "nd-staging", name: "Front Desk (Staging)", env: "staging", segment: "Scheduling + Pre-screening", solutionPacks: [...corePacks()] },
    ],
  },
  {
    id: "lakeshore-derm",
    name: "Lakeshore Dermatology",
    verticalId: "healthcare",
    containers: [
      {
        id: "ld-intake", name: "New Patient Intake", env: "production", segment: "Pre-screening + Scheduling",
        solutionPacks: [
          ...corePacks(),
          { id: "prescreen", name: "Pre-screening", description: "Collect symptoms and intake before booking", category: "niche", enabled: true },
          { id: "priorauth", name: "Prior Authorization", description: "Check and initiate insurance prior auths", category: "niche", enabled: true },
        ],
      },
    ],
  },

  // Automotive
  {
    id: "apex-auto",
    name: "Apex Auto Group",
    verticalId: "automotive",
    containers: [
      {
        id: "aa-service", name: "Service Bay", env: "production", segment: "Inventory + Quotes",
        solutionPacks: [
          ...corePacks(),
          { id: "inventory", name: "Inventory Sync", description: "Live parts and stock as the source of truth", category: "niche", enabled: true },
          { id: "quotes", name: "Quote Builder", description: "Build and send service quotes on the call", category: "niche", enabled: true },
        ],
      },
      {
        id: "aa-sales", name: "Sales Line", env: "production", segment: "Leads + Follow-ups",
        solutionPacks: [
          ...corePacks(),
          { id: "leadscore", name: "Lead Scoring", description: "Qualify and rank inbound sales leads", category: "niche", enabled: true },
        ],
      },
      { id: "aa-sandbox", name: "Sales Line (Sandbox)", env: "sandbox", segment: "Leads + Follow-ups", solutionPacks: [...corePacks()] },
    ],
  },

  // Home & Field Services
  {
    id: "meridian-home",
    name: "Meridian Home Services",
    verticalId: "field-services",
    containers: [
      {
        id: "mh-dispatch", name: "Dispatch", env: "production", segment: "Scheduling + Routing",
        solutionPacks: [
          ...corePacks(),
          { id: "routing", name: "Dispatch Routing", description: "Assign jobs by location and crew availability", category: "niche", enabled: true },
        ],
      },
      {
        id: "mh-quotes", name: "Quotes Desk", env: "staging", segment: "Pricing + Quotes",
        solutionPacks: [
          ...corePacks(),
          { id: "quotes", name: "Quote Builder", description: "Build and send service quotes on the call", category: "niche", enabled: true },
          { id: "inventory", name: "Inventory Sync", description: "Live materials and stock as the source of truth", category: "niche", enabled: false },
        ],
      },
    ],
  },

  // Professional Services
  {
    id: "harbor-law",
    name: "Harbor & Pine Law",
    verticalId: "professional",
    containers: [
      {
        id: "hp-intake", name: "Client Intake", env: "production", segment: "Screening + Scheduling",
        solutionPacks: [
          ...corePacks(),
          { id: "conflict", name: "Conflict Check", description: "Screen new matters against existing clients", category: "niche", enabled: true },
          { id: "intakeforms", name: "Intake Forms", description: "Capture matter details before consultation", category: "niche", enabled: true },
        ],
      },
    ],
  },

  // Hospitality & Wellness
  {
    id: "serenity-spa",
    name: "Serenity Spa & Wellness",
    verticalId: "wellness",
    containers: [
      {
        id: "ss-bookings", name: "Bookings", env: "production", segment: "Scheduling + Upsells",
        solutionPacks: [
          ...corePacks(),
          { id: "memberships", name: "Memberships", description: "Manage member tiers, perks, and renewals", category: "niche", enabled: true },
          { id: "upsell", name: "Service Upsell", description: "Suggest add-ons and packages during booking", category: "niche", enabled: true },
        ],
      },
    ],
  },
];

// Companies sorted by vertical order, then alphabetically within a vertical.
const verticalOrder = new Map(VERTICALS.map((v, i) => [v.id, i]));
export const COMPANIES: Company[] = [...RAW_COMPANIES].sort((a, b) => {
  const va = verticalOrder.get(a.verticalId) ?? 99;
  const vb = verticalOrder.get(b.verticalId) ?? 99;
  return va - vb || a.name.localeCompare(b.name);
});

/** Companies grouped by vertical, in vertical order, for the switcher. */
export function companiesByVertical(): { vertical: Vertical; companies: Company[] }[] {
  return VERTICALS.map((vertical) => ({
    vertical,
    companies: COMPANIES.filter((c) => c.verticalId === vertical.id),
  })).filter((g) => g.companies.length > 0);
}

export function getVertical(id: string): Vertical {
  return VERTICALS.find((v) => v.id === id) ?? VERTICALS[0];
}

type WorkspaceValue = {
  companies: Company[];
  company: Company;
  vertical: Vertical;
  container: Container;
  /** Solution packs for the active container, with live toggle state applied. */
  solutionPacks: SolutionPack[];
  setCompanyId: (id: string) => void;
  setContainerId: (id: string) => void;
  togglePack: (packId: string) => void;
};

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyIdState] = useState(COMPANIES[0].id);
  const company = COMPANIES.find((c) => c.id === companyId) ?? COMPANIES[0];

  const [containerId, setContainerId] = useState(company.containers[0].id);
  const container =
    company.containers.find((c) => c.id === containerId) ?? company.containers[0];

  // Per-container, per-pack enabled overrides so toggles persist across switches.
  const [packOverrides, setPackOverrides] = useState<Record<string, Record<string, boolean>>>({});

  const solutionPacks = useMemo(
    () =>
      container.solutionPacks.map((p) => ({
        ...p,
        enabled: packOverrides[container.id]?.[p.id] ?? p.enabled,
      })),
    [container, packOverrides],
  );

  const togglePack = (packId: string) => {
    setPackOverrides((prev) => {
      const current = prev[container.id]?.[packId];
      const base = container.solutionPacks.find((p) => p.id === packId)?.enabled ?? false;
      const next = !(current ?? base);
      return { ...prev, [container.id]: { ...prev[container.id], [packId]: next } };
    });
  };

  // Switching company resets to that company's first container.
  const setCompanyId = (id: string) => {
    setCompanyIdState(id);
    const next = COMPANIES.find((c) => c.id === id) ?? COMPANIES[0];
    setContainerId(next.containers[0].id);
  };

  const value = useMemo<WorkspaceValue>(
    () => ({
      companies: COMPANIES,
      company,
      vertical: getVertical(company.verticalId),
      container,
      solutionPacks,
      setCompanyId,
      setContainerId,
      togglePack,
    }),
    [company, container, solutionPacks],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
