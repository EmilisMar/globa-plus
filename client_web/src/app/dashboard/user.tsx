import { useLoaderData } from 'react-router-dom'

import type { UserT } from '../../apis/types/auth.api.type'
import { ObjView } from '../../components/ObjView'

export const UserPage = () => {
	const { user } = useLoaderData() as { user: UserT }
	return <ObjView data={user} />
}
