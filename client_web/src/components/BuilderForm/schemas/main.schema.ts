import { z } from '@mariuzm/form'

import { RecipientApprovByE } from '../../../apis/types/entities.api.type'
import { t } from '../../../utils/i18n.util'

export const AddProviderS = z.object({
	companyName: z.string().min(1).max(256),
	companyCode: z.string().min(1).max(50),
	email: z.string().min(1).max(50).email(),
})

export type AddProviderT = z.infer<typeof AddProviderS>

export const AddRecipientS = z
	.object({
		providerPid: z.string().min(1).max(50),
		firstName: z.string().min(1).max(50),
		lastName: z.string().min(1).max(50),
		address: z
			.object({
				full_address: z.string().max(256),
				adddress_line: z.string().min(1).max(100).optional(),
				town: z.string().min(1).max(50).optional(),
				postCode: z.string().min(1).max(50).optional(),
				country: z.string().min(1).max(50).optional(),
				latitude: z.number().nullable().optional(),
				longitude: z.number().nullable().optional(),
			})
			.refine(
				(data) => !!data.full_address && !!data.adddress_line && !!data.town && !!data.postCode && !!data.country,
				{
					message: t('t.selectCorrectAddress'),
					path: ['full_address'],
				}
			),
		phone: z.string().min(1).max(50),
		notes: z.string().optional(),
		hourlyRate: z.number(),
		serviceGroups: z.array(z.string().min(1)),
		approveBy: z.enum([RecipientApprovByE.EMAIL, RecipientApprovByE.SIGNATURE]),
		email: z.string().email().optional(),
	})
	.refine(
		(f) => {
			return f.approveBy !== RecipientApprovByE.EMAIL || (f.email && f.email.length > 0)
		},
		{ message: 'Email is required.', path: ['email'] },
	)

export type AddRecipientT = z.infer<typeof AddRecipientS>

export const AddWorkerS = z.object({
	providerPid: z.string().min(1).max(50),
	email: z.string().min(1).max(50).email(),
	firstName: z.string().min(1).max(50),
	lastName: z.string().min(1).max(50),
	phone: z.string().min(1).max(50),
})

export type AddWorkerT = z.infer<typeof AddWorkerS>

export const AddVisitS = z.object({
	workerPid: z.string().min(1).max(50),
	recipientPid: z.string().min(1).max(50),
	timeFrom: z.date(),
	timeTo: z.date(),
	isWeeklyRecurring: z.boolean().optional(),
})

export type AddVisitT = z.infer<typeof AddVisitS>

export const AddCategoryS = z.object({
	categoryGroup: z.string().min(1).max(50),
	name: z.string().min(1).max(256),
})

export type AddCategoryT = z.infer<typeof AddCategoryS>

export const AddServiceS = z.object({
	name: z.string().min(1).max(256),
	categoryPid: z.string().min(1).max(50),
	time: z.string().min(1).max(50),
})

export type AddServiceT = z.infer<typeof AddServiceS>

export const AddEditTimeS = z.object({
	timeFrom: z.date(),
	timeTo: z.date(),
})

export type AddEditTimeT = z.infer<typeof AddEditTimeS>
