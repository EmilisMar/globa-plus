import { DateValue } from '@mantine/dates'
import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateUser } from '../../states/user.state'
import type { TableNamesT } from '../types/entities.api.type'

export const API_GET_Table = async (table: TableNamesT, dateFrom?: DateValue, dateEnd?: DateValue) => {
	const role = useStateUser.getState().user?.role;
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND);
	
	// Create a URLSearchParams instance to handle query parameters
	const params = new URLSearchParams();

	// Append dateFrom and dateEnd if they are provided
	if (dateFrom) {
		params.append('dateFrom', dateFrom.toISOString());
	}
	if (dateEnd) {
		params.append('dateEnd', dateEnd.toISOString());
	}
	
	// Build the complete URL with query parameters
	const queryString = params.toString();
	const url = `/${role}/entity/${table}${queryString ? `?${queryString}` : ''}`;
	
	// Make the API request
	return await req.get(url);
};

export const API_GET_Detail = async (table: TableNamesT, pid: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.get(`/${role}/entity/${table}/${pid}`)
}
