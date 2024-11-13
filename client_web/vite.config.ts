import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react({ babel: { plugins: [['babel-plugin-react-compiler']] } })],
	optimizeDeps: {
		include: ['@react-google-maps/api'],
	},
	resolve: {
		// Ensures that the plugin dependencies are correctly resolved
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		watch: {
		  usePolling: true, // Use polling for file changes
		},
	  },
})
