import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../db/main.tables'

export const db = drizzle(
	postgres(process.env.DATABASE_URL, {
		connect_timeout: 300,
	}),
	{
		schema,
	},
)
