declare namespace NodeJS {
	interface ProcessEnv {
		DATABASE_URL: string
		WEB_ADMIN_URL: string

		EMAIL_SMTP: string
		EMAIL_SMTP_PORT: string
		EMAIL_USER: string
		EMAIL_PASS: string

		TOKEN_KEY: string
	}
}
