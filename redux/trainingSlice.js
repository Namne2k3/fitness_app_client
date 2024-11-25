import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dataTraining: null, // Lưu thông tin toàn bộ buổi tập
    isCompleted: false, // Trạng thái hoàn thành
    elapsedTime: 0,     // Thời gian đã trôi qua
    isRunning: true,    // Trạng thái chạy/dừng
};

const trainingSlice = createSlice({
    name: 'training',
    initialState,
    reducers: {
        setTrainingData(state, action) {
            state.dataTraining = action.payload;
        },
        updateSet(state, action) {
            const { exerciseId, setIndex, kilogram, reps } = action.payload;
            const exercise = state.dataTraining.exercises.find(e => e.exercise.id === exerciseId);
            if (exercise) {
                const set = exercise.sets[setIndex];
                if (set) {
                    set.kilogram = kilogram;
                    set.reps = reps;
                }
            }
        },
        addSet(state, action) {
            const { exerciseId } = action.payload;
            const exercise = state.dataTraining.exercises.find(e => e.exercise.id === exerciseId);
            if (exercise) {
                exercise.sets.push({ kilogram: 0, reps: 1 });
            }
        },
        removeLastSet(state, action) {
            const { exerciseId } = action.payload;
            const exercise = state.dataTraining.exercises.find(e => e.exercise.id === exerciseId);
            if (exercise && exercise.sets.length > 1) {
                exercise.sets.pop();
            }
        },
        updateIsCheck(state, action) {
            const { exerciseId, setIndex, isCheck } = action.payload;
            const exercise = state.dataTraining.exercises.find(e => e.exercise.id === exerciseId);
            if (exercise) {
                const set = exercise.sets[setIndex];
                if (set) {
                    set.isCheck = isCheck;
                }
            }
        },
        setElapsedTime(state, action) {
            state.elapsedTime = action.payload;
        },
        toggleRunning(state) {
            state.isRunning = !state.isRunning;
        },
        setCompleted(state) {
            state.isCompleted = state.dataTraining.exercises.every(exercise =>
                exercise.sets.every(set => set.isCheck)
            );
        },
        resetTrainingState: () => ({
            isCompleted: false,
            elapsedTime: 0,
            isRunning: true,
        })
    },
});

export const {
    setTrainingData,
    updateSet,
    addSet,
    removeLastSet,
    updateIsCheck,
    setElapsedTime,
    toggleRunning,
    setCompleted,
    resetTrainingState
} = trainingSlice.actions;

export default trainingSlice.reducer;
