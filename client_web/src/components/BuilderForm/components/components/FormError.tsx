import { Color } from '../../../../styles/base.style'

export const FormError = ({ message }: { message?: string }) => {
	return (
		<div>
			{message && (
				<p style={{ color: Color.Error, fontSize: 12, marginTop: -2, position: 'absolute' }}>
					{message.toString()}
				</p>
			)}
		</div>
	)
}
3
