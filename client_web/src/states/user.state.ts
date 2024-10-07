import { create } from 'zustand'

import type { UserT } from '../apis/types/auth.api.type'

type T = {
	user: UserT | null
	setUser: (user: UserT | null) => void
}

export const useStateUser = create<T>((set): T => {
	return {
		user: null,
		setUser: (user) => set({ user }),
	}
})
