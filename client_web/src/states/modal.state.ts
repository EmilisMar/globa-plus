import { create } from 'zustand'

type T = {
	row: never | null | any
	setRow: (row: any) => void
}

export const useStoreModal = create<T>((set): T => {
	return {
		row: null,
		setRow: (row) => set({ row }),
	}
})
