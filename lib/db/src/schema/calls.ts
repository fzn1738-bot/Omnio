import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const callsTable = pgTable("calls", {
  id: serial("id").primaryKey(),
  callerName: text("caller_name"),
  phone: text("phone").notNull(),
  direction: text("direction").notNull().default("inbound"),
  status: text("status").notNull().default("completed"),
  duration: integer("duration"),
  sentiment: real("sentiment"),
  agentType: text("agent_type"),
  outcome: text("outcome"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCallSchema = createInsertSchema(callsTable).omit({ id: true, createdAt: true });
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof callsTable.$inferSelect;
