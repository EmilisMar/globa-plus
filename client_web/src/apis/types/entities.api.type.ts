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
}

export type RecipientT = {
	pid: string
	firstName: string
	lastName: string
	address: {
		adddressLine: string
		town: string
		postCode: string
		country: string
	} | null
	phone: string
	notes: string | null
	hourlyRate: number
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
	recipient: {
		pid: string
		fullName: string
		address: RecipientT['address']
		phone: string
		approveBy: `${RecipientApprovByE}`
		createdBy: string
	}
	visitLogs: {
		pid: string
		visitPid: string
		workerPid: string
		timeFrom: string
		timeTo: string
		status: WorkerVisitT['status']
	}[]
}
