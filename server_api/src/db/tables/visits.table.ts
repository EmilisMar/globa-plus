import { json, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import { RecipientsTable } from './recipients.table'
import { ServicesTable } from './services.table'
import { UsersTable } from './users.table'

export const VisitStatusE = pgEnum('status', [
	'NOT_STARTED',
	'STARTED',
	'SERVICE_COMPLETED',
	'PAUSED',
	'ENDED',
	'AWAITING_APPROVAL',
	'APPROVED',
	'CANCELLED',
]).enumValues

export type VisitStatusT = (typeof VisitStatusE)[number]

export const VisitsTable = pgTable('visits', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	recipientPid: varchar('recipient_pid')
		.references(() => RecipientsTable.pid)
		.notNull(),
	workerPid: varchar('worker_pid')
		.references(() => UsersTable.pid)
		.notNull(),
	status: varchar('status', { length: 256, enum: VisitStatusE }).$type<VisitStatusT>().notNull(),
	timeFrom: timestamp('time_from', { withTimezone: true }).notNull(),
	timeTo: timestamp('time_to', { withTimezone: true }).notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type VisitT = typeof VisitsTable.$inferSelect

export const VisitsLogsTable = pgTable('visits_logs', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	visitPid: varchar('visit_pid')
		.references(() => VisitsTable.pid)
		.notNull(),
	servicePid: varchar('service_pid').references(() => ServicesTable.pid),
	actionStatus: varchar('action_status', { length: 256, enum: VisitStatusE })
		.$type<VisitStatusT>()
		.notNull(),
	timeLog: timestamp('time_log', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	workerLocation: json('worker_location').$type<{ lat: number; lon: number }>(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type VisitLogT = typeof VisitsLogsTable.$inferSelect

export const VisitsApprovalsTable = pgTable('visits_approvals', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	visitPid: varchar('visit_pid')
		.references(() => VisitsTable.pid)
		.notNull(),
	signature: text('signature'),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type VisitSignatureT = typeof VisitsApprovalsTable.$inferSelect
