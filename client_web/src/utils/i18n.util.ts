import i18next, * as i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, useTranslation } from 'react-i18next'

import type { NestedKeyOf } from '@mariuzm/utils'

import en from '../locales/en.locale.json'
import lt from '../locales/lt.locale.json'

const ld = new LanguageDetector()
const LANGS = ['en', 'lt'] as const
type Lang = (typeof LANGS)[number]

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: { en: typeof en }
	}
}

export default i18n
	.use(initReactI18next)
	.use(ld)
	.init({
		resources: { en: { translation: en }, lt: { translation: lt } },
		fallbackLng: 'lt',
		lng: 'lt',
		debug: true,
	})

export const t = (key: NestedKeyOf<typeof en>): string => i18n.t(key)
export const useT = () => useTranslation().t as (key: NestedKeyOf<typeof en>) => string
export const getL = () => i18next.language || window.localStorage.i18nextLng
export const postL = (lang: Lang) => i18n.changeLanguage(lang)

export const lo: Record<string, string> = {
	actionStatus: t('t.actionStatus'),
	address: t('t.address'),
	addressLine1: t('t.addressLine1'),
	addressLine: t('t.addressLine'),
	approveBy: t('t.approveBy'),
	approvedBy: t('t.approvedBy'),
	categories: t('t.categories'),
	categoryName: t('t.categoryName'),
	companyCode: t('t.companyCode'),
	companyName: t('t.companyName'),
	country: t('t.country'),
	createdAt: t('t.createdAt'),
	createdBy: t('t.createdBy'),
	createdByEmail: t('t.createdByEmail'),
	createdByRole: t('t.createdByRole'),
	email: t('email'),
	firstName: t('t.firstName'),
	fullName: t('t.fullName'),
	hourlyRate: t('t.hourlyRate'),
	lastName: t('t.lastName'),
	lat: t('t.lat'),
	lon: t('t.lon'),
	name: t('t.name'),
	phone: t('t.phone'),
	postCode: t('t.postCode'),
	providers: t('t.providers'),
	recipient: t('t.recipient'),
	recipients: t('t.recipients'),
	reports: t('t.reports'),
	selectCorrectAddress: t('t.selectCorrectAddress'),
	serviceName: t('t.serviceName'),
	services: t('t.services'),
	servicesCompleted: t('t.servicesCompleted'),
	servicesCompletedHours: t('t.servicesCompletedHours'),
	serviceGroup: t('t.serviceGroup'),
	status: t('t.status'),
	time: t('t.time'),
	timeFrom: t('t.timeFrom'),
	timeLog: t('t.timeLog'),
	timeTo: t('t.timeTo'),
	town: t('t.town'),
	visitLogs: t('t.visitLogs'),
	visits: t('t.visits'),
	visitsCount: t('t.visitsCount'),
	visitConfirmationMethod: t('t.visitConfirmationMethod'),
	workers: t('t.workers'),
}
