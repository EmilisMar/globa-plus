import { pgTable, serial, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'

import { CategoriesTable } from './categories.table'
import { UsersTable } from './users.table'

export const ServicesTable = pgTable('services', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 256 }).notNull(),
	categoryPid: varchar('category_pid')
		.references(() => CategoriesTable.pid)
		.notNull(),
	time: smallint('time').notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type ServiceT = typeof ServicesTable.$inferSelect
