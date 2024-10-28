import Handlebars from 'handlebars'

import { sendMail } from '../nodemailer.provider'
import { EmailTemplates, readFile } from '../utils/file.util'

export const emailVisitApproval = ({
	email,
	name,
	vPid,
}: {
	email: string
	name: string
	vPid: string
}) => {
	const template = Handlebars.compile(readFile(EmailTemplates.EMAIL_VISIT_APPROVAL))
	const mailOptions = {
		from: `"Globa Plius" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: 'Paslaugų teikimo patvirtinimas',
		html: template({ name, link: `${process.env.WEB_ADMIN_URL}/visit-approval/${vPid}` }),
	}
	sendMail(mailOptions)
}
