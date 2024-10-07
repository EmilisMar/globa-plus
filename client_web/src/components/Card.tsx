import { Color, Style } from '../styles/base.style'

export const Card = ({ img, title, email }: { img: string; title: string; email?: string }) => {
	return (
		<div
			style={{
				backgroundColor: Color.Primary,
				borderRadius: Style.Radius,
				display: 'flex',
				flexDirection: 'column',
				height: '300px',
				justifyContent: 'space-between',
				overflow: 'hidden',
				position: 'relative',
				width: '250px',
			}}
		>
			<img src={img} alt={title} style={{ height: '100%', objectFit: 'cover', width: '100%' }} />

			<div
				style={{
					backgroundColor: Color.PrimaryDark,
					borderRadius: Style.Radius,
					bottom: 0,
					color: Color.White,
					margin: '12px',
					padding: '12px',
					position: 'absolute',
					zIndex: 1,
					width: 'calc(100% - 24px)',
				}}
			>
				<h2>{title}</h2>
				<p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{email}</p>
			</div>
		</div>
	)
}
