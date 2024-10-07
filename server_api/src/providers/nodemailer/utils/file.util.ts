import { readFileSync } from 'fs'

export enum EmailTemplates {
	EMAIL_VALIDATION = 'email-validation.html',
	EMAIL_VISIT_APPROVAL = 'email-visit-approval.html',
}

type EmailTemplateType = EmailTemplates

export const readFile = (path: EmailTemplateType) => {
	return readFileSync(process.cwd() + '/assets/templates/' + path, {
		encoding: 'utf-8',
	})
}
