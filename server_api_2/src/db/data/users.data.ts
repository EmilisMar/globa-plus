import { genId } from '../../utils/genId.util'
import type { UserAdminT, UserT } from '../tables/users.table'

const pass =
	'$argon2id$v=19$m=65536,t=3,p=4$YS96NNy+wyZL+W+3MkiWkw$A+7pmejtmN/EO1Oea2DrgZHBx7KoIyZMLngcM0y2z6Q'

export const USERS_DATA: Omit<UserT, 'id' | 'createdAt'>[] = [
	{
		pid: genId(),
		email: 'admin@care.app',
		role: 'admin',
	},
	{
		pid: genId(),
		email: 'admin_visit_approver@care.app',
		role: 'admin',
	},
]

export const USERS_ADMIN_DATA: Omit<UserAdminT, 'id' | 'createdAt'>[] = [
	{
		pid: USERS_DATA[0]?.pid as string,
		firstName: 'Admin',
		lastName: 'Admin',
		password: pass,
	},
	{
		pid: USERS_DATA[1]?.pid as string,
		firstName: 'Admin Visit Approver',
		lastName: 'Admin Visit Approver',
		password: pass,
	},
]
