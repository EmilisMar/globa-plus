import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

import type { DB } from '../db/main.tables'

export const dbk = new Kysely<DB>({
	dialect: new PostgresDialect({ pool: new Pool({ connectionString: process.env.DATABASE_URL }) }),
	plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})
