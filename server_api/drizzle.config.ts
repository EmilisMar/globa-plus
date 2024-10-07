import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
	schema: './src/db/main.tables.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL as string },
})
