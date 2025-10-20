import { create } from 'zustand'

interface ActionSheetMenuStore {
    showMenu: boolean;
    setShowMenu: (showMenu: boolean) => void;
}

export const useActionSheetMenuStore = create<ActionSheetMenuStore>((set) => ({
    showMenu: false,
    setShowMenu: (showMenu) => set({ showMenu }),
}));