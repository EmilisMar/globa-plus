import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				red: colors.red['700'],
			},
		},
		screens: {
			sm: { max: '639px' },
			md: { max: '1023px' },
			lg: { max: '1279px' },
			xl: { max: '1535px' },
		},
	},
}
