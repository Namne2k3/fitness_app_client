import { RootState } from "./store";

export const selectGetUser = (state: RootState) =>
    state.UserReduxReducer.user