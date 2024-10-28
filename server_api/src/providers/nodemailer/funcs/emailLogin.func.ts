import Handlebars from 'handlebars'

import { sendMail } from '../nodemailer.provider'
import { EmailTemplates, readFile } from '../utils/file.util'

export const emailLogin = ({
	email,
	name,
	token,
}: {
	email: string
	name: string
	token: string
}) => {
	const template = Handlebars.compile(readFile(EmailTemplates.EMAIL_VALIDATION))
	const mailOptions = {
		from: `"Globa Plius" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: 'Nuoroda prisijungimui',
		html: template({ name, link: `${process.env.WEB_ADMIN_URL}/validate/${token}` }),
	}
	sendMail(mailOptions)
}
