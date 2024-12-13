export type TableNamesT =
	| 'providers'
	| 'recipients'
	| 'recipients-with-admins'
	| 'workers'
	| 'visits'
	| 'categories'
	| 'services'
	| 'reports'

export type GetWorkerVisitT = {
	id: string
	workerPid: string
	start: string
	end: string
	recipientName: string
}

export type CategorieT = {
    pid: string
    categoryGroupPid: string
    name: string
}

export type RecipientT = {
	pid: string
	firstName: string
	lastName: string
	address: {
		fullAddress: string
		adddressLine: string
		town: string
		postCode: string
		country: string
		latitude: number
		longitude: number
	} | null
	phone: string
	notes: string | null
	hourlyRate: number
	serviceGroups: string[]
	approveBy: `${RecipientApprovByE}`
	email: string | null
	createBy: string
}

export enum RecipientApprovByE {
	EMAIL = 'email',
	SIGNATURE = 'signature',
}

export type ProviderT = {
	pid: string
	email: string
	companyName: string
	companyCode: string
	createAt: string
}

export type WorkerPosT = {
	workerPid: string
	visitPid: string
	lat: number
	lon: number
	dist: number
}

export type WorkerVisitT = {
	pid: string
	workerPid: string
	timeFrom: string
	timeTo: string
	status:
		| 'NOT_STARTED'
		| 'STARTED'
		| 'PAUSED'
		| 'PROVIDER_ADD_TIME'
		| 'SERVICE_COMPLETED'
		| 'SERVICE_UNCHECK'
		| 'CANCELLED'
		| 'ENDED'
		| 'APPROVED'
	recipient: {
		pid: string
		fullName: string
		address: RecipientT['address']
		phone: string
		approveBy: `${RecipientApprovByE}`
		createdBy: string
		categories?: Array<{
			name: string
			services: Array<{
				pid: string
				name: string
			}>
		}>
		notes?: string
	}
	categories: Array<CategorieT>,
	visitLogs: {
		pid: string
		visitPid: string
		workerPid: string
		timeFrom: string
		timeTo: string
		status: WorkerVisitT['status']
	}[]
}
