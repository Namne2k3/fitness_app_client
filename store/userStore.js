import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    setUser: (userData) => {
        console.log("Setting user data:", userData);
        set({ user: userData });
    },
    clearUser: () => set({ user: null }),
}));

export default useUserStore;
