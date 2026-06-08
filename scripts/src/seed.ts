/**
 * Seeds the Omnio agent roster: the 9 revenue-earning product agents and the
 * 8 ops agents that watch and repair them. Idempotent — clears the table first.
 *
 * Run with: pnpm --filter @workspace/scripts run seed
 * Requires DATABASE_URL to be set.
 */
import { db, agentsTable, type InsertAgent } from "@workspace/db";

const productAgents: InsertAgent[] = [
  { name: "Voice Agent", tier: "product", role: "Spoken interface for inbound & outbound calls", status: "active", successRate: 97.4, callsHandled: 18420, avgResponseMs: 280, isActive: true },
  { name: "Intent Router", tier: "product", role: "Classifies caller intent and routes to the right specialist", status: "active", successRate: 95.1, callsHandled: 18420, avgResponseMs: 90, isActive: true },
  { name: "Scheduling Agent", tier: "product", role: "Books, reschedules, and cancels against calendars", status: "active", successRate: 93.8, callsHandled: 7240, avgResponseMs: 420, isActive: true },
  { name: "Follow-up Agent", tier: "product", role: "Nurtures leads pre-sale and runs post-sale touchpoints", status: "active", successRate: 91.2, callsHandled: 5310, avgResponseMs: 350, isActive: true },
  { name: "Inventory & Pricing Agent", tier: "product", role: "Source of truth for services, prices, stock, and quotes", status: "active", successRate: 96.0, callsHandled: 3980, avgResponseMs: 510, isActive: true },
  { name: "Knowledge / RAG Agent", tier: "product", role: "Answers from business info, FAQs, and policies", status: "active", successRate: 94.5, callsHandled: 9120, avgResponseMs: 610, isActive: true },
  { name: "CRM / Records Agent", tier: "product", role: "Reads and writes customer history, preferences, and notes", status: "active", successRate: 98.1, callsHandled: 12030, avgResponseMs: 240, isActive: true },
  { name: "Notification Agent", tier: "product", role: "Sends SMS and email confirmations, reminders, and receipts", status: "active", successRate: 99.0, callsHandled: 14600, avgResponseMs: 180, isActive: true },
  { name: "Escalation / Handoff Agent", tier: "product", role: "Hands off to a human cleanly, with context attached", status: "idle", successRate: 92.7, callsHandled: 1340, avgResponseMs: 200, isActive: true },
];

// Ops agents listed in self-healing pipeline order.
const opsAgents: InsertAgent[] = [
  { name: "Log Collector", tier: "ops", role: "Pulls and normalizes logs, metrics, and traces from every product agent", status: "active", successRate: 99.6, callsHandled: 0, avgResponseMs: 60, isActive: true },
  { name: "Triage", tier: "ops", role: "Decides what is a real problem versus noise", status: "active", successRate: 96.3, callsHandled: 0, avgResponseMs: 140, isActive: true },
  { name: "Diagnosis", tier: "ops", role: "Correlates the signals and lands on a likely root cause", status: "active", successRate: 90.4, callsHandled: 0, avgResponseMs: 880, isActive: true },
  { name: "Fix Planner", tier: "ops", role: "Turns a cause into ranked candidate fixes scored by risk and impact", status: "active", successRate: 88.9, callsHandled: 0, avgResponseMs: 720, isActive: true },
  { name: "Validation", tier: "ops", role: "Tests the proposed fix in a sandbox and checks for regressions", status: "active", successRate: 94.7, callsHandled: 0, avgResponseMs: 1500, isActive: true },
  { name: "Approval Gate", tier: "ops", role: "Human-in-the-loop checkpoint: shows diagnosis, fix, validation, blast radius", status: "idle", successRate: 100, callsHandled: 0, avgResponseMs: 0, isActive: true },
  { name: "Executor", tier: "ops", role: "Applies the approved change with a rollback path ready", status: "active", successRate: 97.2, callsHandled: 0, avgResponseMs: 640, isActive: true },
  { name: "Verifier", tier: "ops", role: "Confirms the issue is gone and auto-rolls-back if it degrades", status: "active", successRate: 98.5, callsHandled: 0, avgResponseMs: 900, isActive: true },
];

async function seed() {
  const agents = [...productAgents, ...opsAgents];
  console.log(`Seeding ${agents.length} agents (${productAgents.length} product, ${opsAgents.length} ops)...`);

  await db.delete(agentsTable);
  await db.insert(agentsTable).values(agents);

  console.log("Done.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
