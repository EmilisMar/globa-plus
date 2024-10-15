import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import './styles/index.style.css'

import { createRoot } from 'react-dom/client'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

import { API_GET_Visit } from './apis/entities/visits.api.entity'
import { API_GET_WorkerVisits } from './apis/entities/workers.api.entity'
import { LoginPage } from './app'
import { RootLayout } from './app/_layout'
import { AdminLoginPage } from './app/admin'
import { DashboardLayout } from './app/dashboard/_layout'
import { CategoriesPage } from './app/dashboard/categories'
import { ProvidersPage } from './app/dashboard/providers'
import { RecipientsPage } from './app/dashboard/recipients'
import { ReportsPage } from './app/dashboard/reports'
import { ServicePage } from './app/dashboard/services'
import { ProviderVisitPage, WorkerVisitPage } from './app/dashboard/visit'
import { VisitsPage } from './app/dashboard/visits'
import { ProviderWorkerPage } from './app/dashboard/worker'
import { WorkersPage } from './app/dashboard/workers'
import { ValidatePage } from './app/validate'
import { VisitApprovalPage } from './app/visit-approval'
import { AuthGuard } from './components/AuthGuard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BookOpenIcon, BusinessIcon, TagIcon, UsersIcon } from './components/Icons'
import { useStateData } from './states/data.state'
import { t } from './utils/i18n.util'

export const ROUTES_NAV: Record<string, Record<string, { name: string; icon: JSX.Element }>> = {
	admin: {
		providers: { name: t('menu.providers'), icon: <BusinessIcon /> },
		recipients: { name: t('menu.recipients'), icon: <UsersIcon /> },
		categories: { name: t('menu.categories'), icon: <TagIcon /> },
		services: { name: t('menu.services'), icon: <BookOpenIcon /> },
		reports: { name: t('menu.reports'), icon: <BookOpenIcon /> },
	},
	provider: {
		recipients: { name: t('menu.recipients'), icon: <UsersIcon /> },
		workers: { name: t('menu.workers'), icon: <UsersIcon /> },
		visits: { name: t('menu.visits'), icon: <BookOpenIcon /> },
		categories: { name: t('menu.categories'), icon: <TagIcon /> },
		services: { name: t('menu.services'), icon: <BookOpenIcon /> },
		reports: { name: t('menu.reports'), icon: <BookOpenIcon /> },
	},
	worker: {
		visits: { name: t('menu.visits'), icon: <BookOpenIcon /> },
	},
}

export const ROUTES: RouteObject[] = [
	{
		id: 'root',
		path: '/',
		element: (
			<AuthGuard>
				<RootLayout />
			</AuthGuard>
		),
		children: [
			{ id: 'login', path: '/', element: <LoginPage /> },
			{ id: 'admin_login', path: '/admin', element: <AdminLoginPage /> },
			{ id: 'validate', path: '/validate/:token', element: <ValidatePage /> },
			{ id: 'visit-approval', path: '/visit-approval/:vPid', element: <VisitApprovalPage /> },
		],
		ErrorBoundary: () => <ErrorBoundary />,
	},
	{
		id: 'admin_dashboard',
		path: '/admin/dashboard',
		element: (
			<AuthGuard>
				<DashboardLayout />
			</AuthGuard>
		),
		children: [
			{ id: 'admin_providers', path: 'providers', element: <ProvidersPage /> },
			{ id: 'admin_recipients', path: 'recipients', element: <RecipientsPage /> },
			{ id: 'admin_categories', path: 'categories', element: <CategoriesPage /> },
			{ id: 'admin_services', path: 'services', element: <ServicePage /> },
			{ id: 'admin_reports', path: 'reports', element: <ReportsPage /> },
		],
	},
	{
		id: 'provider_dashboard',
		path: '/provider/dashboard',
		element: (
			<AuthGuard>
				<DashboardLayout />
			</AuthGuard>
		),
		children: [
			{ id: 'provider_recipients', path: 'recipients', element: <RecipientsPage /> },
			{ id: 'provider_workers', path: 'workers', element: <WorkersPage /> },
			{
				id: 'provider_worker',
				path: 'workers/:workerPid',
				element: <ProviderWorkerPage />,
				loader: async (p) => await API_GET_WorkerVisits(p.params.workerPid),
			},
			{ id: 'provider_visits', path: 'visits', element: <VisitsPage /> },
			{
				id: 'provider_visit',
				path: 'visits/:visitPid',
				element: <ProviderVisitPage />,
				loader: async ({ params: { visitPid } }) => {
					if (!visitPid) return
					return { visit: await API_GET_Visit(visitPid) }
				},
			},
			{ id: 'provider_categories', path: 'categories', element: <CategoriesPage /> },
			{ id: 'provider_services', path: 'services', element: <ServicePage /> },
			{ id: 'provider_reports', path: 'reports', element: <ReportsPage /> },
		],
	},
	{
		id: 'worker_dashboard',
		path: '/worker/dashboard',
		element: (
			<AuthGuard>
				<DashboardLayout />
			</AuthGuard>
		),
		children: [
			{ id: 'worker_visits', path: 'visits', element: <VisitsPage /> },
			{
				id: 'worker_visit',
				path: 'visits/:visitPid',
				element: <WorkerVisitPage />,
				loader: async ({ params: { visitPid } }) => {
					if (!visitPid) return
					const visit = await API_GET_Visit(visitPid)
					useStateData.getState().setVisit(visit)
					return null
				},
			},
		],
	},
]

createRoot(document.getElementById('root')!).render(
	<>
		<ToastContainer />
		<MantineProvider defaultColorScheme="light">
			<ModalsProvider>
				<RouterProvider router={createBrowserRouter(ROUTES)} />
			</ModalsProvider>
		</MantineProvider>
	</>,
)
