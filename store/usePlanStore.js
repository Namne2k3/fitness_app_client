// store/planStore.js
import { create } from "zustand";

const usePlanStore = create((set) => ({
    plans: [], // Dữ liệu kế hoạch
    setPlans: (plans) => set({ plans }),
    isFetched: false, // Trạng thái đã fetch
    setIsFetched: (status) => set({ isFetched: status }),
}));

export default usePlanStore;
