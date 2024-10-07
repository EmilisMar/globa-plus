import { create } from 'zustand'

import type { WorkerVisitT } from '../apis/types/entities.api.type'

type T = {
	visit: WorkerVisitT | null
	setVisit: (visit: WorkerVisitT | null) => void
}

export const useStateData = create<T>((set): T => {
	return {
		visit: null,
		setVisit: (visit) => set({ visit }),
	}
})
