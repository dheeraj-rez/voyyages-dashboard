import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  json,
  uuid,
} from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  status: text('status').notNull().default('pending'),
  toursCount: integer('tours_count').default(0),
  joinedDate: timestamp('joined_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const agentRequests = pgTable('agent_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: uuid('agent_id').references(() => agents.id),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tours = pgTable('tours', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: uuid('agent_id').references(() => agents.id),
  customerName: text('customer_name').notNull(),
  destination: text('destination').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const agentsRelations = relations(agents, ({ many }) => ({
  tours: many(tours),
  requests: many(agentRequests),
}));

export const toursRelations = relations(tours, ({ one }) => ({
  agent: one(agents, {
    fields: [tours.agentId],
    references: [agents.id],
  }),
}));

export const agentRequestsRelations = relations(agentRequests, ({ one }) => ({
  agent: one(agents, {
    fields: [agentRequests.agentId],
    references: [agents.id],
  }),
})); 