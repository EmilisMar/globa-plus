import {
	doublePrecision,
	json,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core'

import { UsersTable } from './users.table'

export const ApproveByE = pgEnum('approve_by', ['email', 'signature']).enumValues
export type ApproveByT = (typeof ApproveByE)[number]

export const RecipientsTable = pgTable('recipients', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	firstName: varchar('first_name', { length: 256 }).notNull(),
	lastName: varchar('last_name', { length: 256 }).notNull(),
	hourlyRate: doublePrecision('hourly_rate').notNull(),
	address: json('address')
		.$type<AddressT>()
		.$default(() => ({ adddress_line: '', town: '', postCode: '', country: '' })),
	phone: varchar('phone', { length: 256 }).notNull(),
	approveBy: varchar('approve_by', { length: 10, enum: ApproveByE }),
	email: varchar('email', { length: 256 }),
	notes: varchar('notes'),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type RecipientT = typeof RecipientsTable.$inferSelect

type AddressT = {
	adddress_line: string
	town: string
	postCode: string
	country: string
}
