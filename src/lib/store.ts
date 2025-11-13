import { create } from 'zustand'

type AppStore = {
	userProfile: any
}

export const useAppStore = create<AppStore>((set) => ({
	selectedRiders: [],
	membersFromGroup: [],
}))
