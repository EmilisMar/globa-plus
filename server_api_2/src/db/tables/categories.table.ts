import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

import { UsersTable } from './users.table'

export const CategoriesGroupsTable = pgTable('categories_groups', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 256 }).notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export const CategoriesTable = pgTable('categories', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	categoryGroupPid: varchar('category_group_pid')
		.references(() => CategoriesGroupsTable.pid)
		.notNull(),
	name: varchar('name', { length: 256 }).notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type CategorieT = typeof CategoriesTable.$inferSelect
