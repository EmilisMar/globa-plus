import nodemailer from 'nodemailer'

export const sendMail = (mailOptions: nodemailer.SendMailOptions) => {
	try {
		nodemailer
			.createTransport({
				host: process.env.EMAIL_SMTP,
				port: Number(process.env.EMAIL_SMTP_PORT),
				auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
			})
			.sendMail(mailOptions, (err) => {
				if (err) {
					console.log('🚀 ~ err:', JSON.stringify(err))
					console.log('err', err.message)
					console.log('err', err.cause)
				}
			})
	} catch (err: any) {
		console.log('🚀 ~ err:', JSON.stringify(err))
	}
}
