import { create } from 'zustand'

type AppStore = {
  userProfile: any | null
  selectedRiders: any[]
  membersFromGroup: any[]
  setUserProfile: (profile: any) => void
}

export const useAppStore = create<AppStore>((set) => ({
  userProfile: null,
  selectedRiders: [],
  membersFromGroup: [],
  setUserProfile: (profile) => set({ userProfile: profile }),
}))
