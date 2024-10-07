import { t } from '../../../utils/i18n.util'

export const AdminLoginS = {
	initialValues: {
		email: '',
		password: '',
	},
	validate: {
		email: (v: string) => {
			if (!v) return t('email_required')
			if (!v.includes('@')) return t('email_invalid')
			return undefined
		},
		password: (v: string) => {
			if (!v) return t('password_required')
			return undefined
		},
	},
}

export type AdminLoginT = typeof AdminLoginS.initialValues

export const UserLoginS = {
	initialValues: {
		email: '',
	},
	validate: {
		email: (v: string) => {
			if (!v) return t('email_required')
			if (!v.includes('@')) return t('email_invalid')
			return undefined
		},
	},
}

export type UserLoginT = typeof UserLoginS.initialValues
