type AdminT = {
	pid: string
	email: string
	firstName: string
	lastName: string
	createdAt: string
	role: 'admin'
}

type ProviderT = {
	pid: string
	email: string
	companyName: string
	companyCode: string
	createdAt: string
	role: 'provider'
}

type WorkerT = {
	pid: string
	providerPid: string
	email: string
	firstName: string
	lastName: string
	createdAt: string
	role: 'worker'
}

export type UserT = AdminT | ProviderT | WorkerT
export type UserRolesT = AdminT['role'] | ProviderT['role'] | WorkerT['role']
export type LoginResT = { accessToken: string; user: UserT }
