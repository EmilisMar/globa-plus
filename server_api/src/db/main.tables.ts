import type { Kyselify } from 'drizzle-orm/kysely'

import { CategoriesGroupsTable, CategoriesTable } from './tables/categories.table'
import { RecipientsTable } from './tables/recipients.table'
import { ServicesTable } from './tables/services.table'
import {
	UsersAdminsTable,
	UsersProvidersTable,
	UsersTable,
	UsersWorkersTable,
} from './tables/users.table'
import { VisitsApprovalsTable, VisitsLogsTable, VisitsTable } from './tables/visits.table'

export { UsersTable, UsersAdminsTable, UsersProvidersTable, UsersWorkersTable }
export { RecipientsTable }
export { VisitsTable }
export { VisitsLogsTable }
export { VisitsApprovalsTable }
export { CategoriesGroupsTable, CategoriesTable }
export { ServicesTable }

export type DB = {
	users: Kyselify<typeof UsersTable>
	users_admins: Kyselify<typeof UsersAdminsTable>
	users_providers: Kyselify<typeof UsersProvidersTable>
	users_workers: Kyselify<typeof UsersWorkersTable>
	recipients: Kyselify<typeof RecipientsTable>
	visits: Kyselify<typeof VisitsTable>
	visits_logs: Kyselify<typeof VisitsLogsTable>
	visits_approvals: Kyselify<typeof VisitsApprovalsTable>
	categories_groups: Kyselify<typeof CategoriesGroupsTable>
	categories: Kyselify<typeof CategoriesTable>
	services: Kyselify<typeof ServicesTable>
}
