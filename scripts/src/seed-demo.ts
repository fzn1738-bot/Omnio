/**
 * Demo operational data (calls, leads, alerts, activity, appointments, follow-ups)
 * for the in-Claude live deployment so the dashboard and lists look alive.
 *
 * Run with: pnpm --filter @workspace/scripts run seed:demo
 * Idempotent — clears these tables first. Requires DATABASE_URL.
 */
import { db, callsTable, leadsTable, alertsTable, activityTable, appointmentsTable, followUpsTable } from "@workspace/db";

const names = ["Maria Gomez", "James Carter", "Aisha Khan", "Liam O'Brien", "Sofia Rossi", "Noah Williams", "Emma Chen", "Lucas Silva", "Olivia Brown", "Ethan Patel", "Ava Johnson", "Mason Lee", "Isabella Nguyen", "Logan Davis"];
const outcomes = ["Appointment booked", "Quote sent", "Rescheduled", "Lead qualified", "Transferred to human", "Info provided"];
const summaries = ["Booked a cleaning for next Tuesday.", "Asked about pricing for a brake service.", "Rescheduled appointment to Friday.", "New patient intake completed.", "Requested a callback from sales.", "Confirmed insurance coverage."];
const agentTypes = ["Voice Agent", "Scheduling Agent", "Follow-up Agent", "Inventory & Pricing Agent"];

function rand<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

async function main() {
  await Promise.all([
    db.delete(callsTable), db.delete(leadsTable), db.delete(alertsTable),
    db.delete(activityTable), db.delete(appointmentsTable), db.delete(followUpsTable),
  ]);

  const calls = [];
  for (let i = 0; i < 140; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 7));
    d.setHours(7 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60));
    const status = Math.random() < 0.78 ? "completed" : Math.random() < 0.5 ? "missed" : "dropped";
    calls.push({
      callerName: rand(names), phone: `+1 (415) 555-0${100 + i}`.slice(0, 17),
      direction: Math.random() < 0.65 ? "inbound" : "outbound",
      status, duration: 60 + Math.floor(Math.random() * 540),
      sentiment: Math.round((0.4 + Math.random() * 0.6) * 100) / 100,
      agentType: rand(agentTypes), outcome: rand(outcomes), summary: rand(summaries),
      createdAt: d,
    });
  }
  await db.insert(callsTable).values(calls);

  const statuses = ["new", "contacted", "qualified", "converted", "lost"];
  await db.insert(leadsTable).values(names.map((n, i) => ({
    name: n, phone: `+1 (628) 555-1${200 + i}`, email: `${n.split(" ")[0].toLowerCase()}@example.com`,
    status: rand(statuses), source: rand(["Website", "Inbound call", "Referral", "Ad"]),
    value: 200 + Math.floor(Math.random() * 4000), assignedAgent: rand(agentTypes),
    notes: rand(summaries),
  })));

  await db.insert(alertsTable).values([
    { type: "latency", message: "Scheduling Agent p95 latency above 1.5s on Front Desk", severity: "warning", dismissed: false },
    { type: "integration", message: "Calendar API returned 3 timeouts in the last hour", severity: "critical", dismissed: false },
    { type: "info", message: "Verifier auto-rolled back a config change on After Hours", severity: "info", dismissed: false },
  ]);

  await db.insert(activityTable).values(Array.from({ length: 10 }, (_, i) => {
    const d = new Date(); d.setMinutes(d.getMinutes() - i * 17);
    return { type: "event", description: rand([
      "Voice Agent booked an appointment for Maria Gomez",
      "Follow-up Agent sent an SMS reminder",
      "Intent Router routed a pricing question to Inventory Agent",
      "Escalation Agent handed off a call to a human",
      "Notification Agent sent a confirmation email",
    ]), createdAt: d };
  }));

  const today = new Date(); today.setHours(9, 0, 0, 0);
  await db.insert(appointmentsTable).values(Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today); d.setHours(9 + i, 0, 0, 0);
    return { contactName: rand(names), phone: `+1 (415) 555-2${300 + i}`, serviceType: rand(["Cleaning", "Consultation", "Brake Service", "Intake"]), scheduledAt: d, duration: 30, status: "scheduled" };
  }));

  await db.insert(followUpsTable).values(Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setHours(d.getHours() + i * 3);
    return { contactName: rand(names), phone: `+1 (415) 555-3${400 + i}`, type: rand(["nurture", "confirmation", "review"]), status: "pending", scheduledAt: d, channel: rand(["sms", "email"]), message: "Just checking in!" };
  }));

  console.log("Demo data seeded.");
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
