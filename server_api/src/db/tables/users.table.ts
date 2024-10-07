import { pgEnum, pgTable, serial, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'

const UserRolesE = pgEnum('status', ['admin', 'provider', 'worker']).enumValues
export type UserRoleT = (typeof UserRolesE)[number]

export const UsersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	pid: varchar('pid', { length: 50 }).notNull().unique(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	role: varchar('role', { length: 256, enum: UserRolesE }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type UserT = typeof UsersTable.$inferSelect

export const UsersAdminsTable = pgTable('users_admins', {
	id: serial('id').primaryKey(),
	pid: varchar('pid')
		.references(() => UsersTable.pid)
		.notNull(),
	firstName: varchar('first_name', { length: 256 }).notNull(),
	lastName: varchar('last_name', { length: 256 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	password: varchar('password', { length: 256 }).notNull(),
})

export type UserAdminT = typeof UsersAdminsTable.$inferSelect

export const UsersProvidersTable = pgTable('users_providers', {
	id: serial('id').primaryKey(),
	pid: varchar('pid')
		.references(() => UsersTable.pid)
		.notNull(),
	emailCode: smallint('email_code'),
	name: varchar('company_name', { length: 256 }).notNull(),
	companyCode: varchar('company_code', { length: 256 }).notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type UserProviderT = typeof UsersProvidersTable.$inferSelect

export const UsersWorkersTable = pgTable('users_workers', {
	id: serial('id').primaryKey(),
	pid: varchar('pid')
		.references(() => UsersTable.pid)
		.notNull(),
	emailCode: smallint('email_code'),
	firstName: varchar('first_name', { length: 256 }).notNull(),
	lastName: varchar('last_name', { length: 256 }).notNull(),
	phone: varchar('phone', { length: 256 }).notNull(),
	createdBy: varchar('created_by')
		.references(() => UsersTable.pid)
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export type UserWorkerT = typeof UsersWorkersTable.$inferSelect
