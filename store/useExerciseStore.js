import { create } from 'zustand';

const useExerciseStore = create((set) => ({
    exercises: [],
    filteredExercises: [],
    searchQuery: '',
    skip: 0,
    limit: 10,
    total: 0,
    setExercises: (data) => set({ exercises: data, filteredExercises: data.slice(0, 10), total: data.length }),
    setSearchQuery: (query) => set((state) => {
        const filtered = state.exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(query.toLowerCase())
        );
        return {
            searchQuery: query,
            filteredExercises: filtered.slice(0, 10),
            skip: 0,
        };
    }),
    loadMore: () => set((state) => {
        const nextSkip = state.skip + state.limit;
        const additionalData = state.exercises
            .filter((exercise) =>
                exercise.name.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
            .slice(nextSkip, nextSkip + state.limit);

        return {
            skip: nextSkip,
            filteredExercises: [...state.filteredExercises, ...additionalData],
        };
    }),
    reloadExercises: () => set((state) => ({
        filteredExercises: state.exercises.slice(0, state.limit),
        skip: 0,
    })),
}));

export default useExerciseStore;
