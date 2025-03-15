import { UserModel } from "@/models/UserModel";
import UserReduxTypes from "./UserReduxTypes";

export type UserReduxState = {
    user: UserModel | null;
}

const initialData: UserReduxState = {
    user: null
};

const UserReduxReducer = (state: UserReduxState = initialData, actions: any): UserReduxState => {
    // const { data } = actions;
    switch (actions.type) {
        case UserReduxTypes.SetUser:
            return {
                ...state,
                user: actions.data,
            }

        default:
            return state;
    }
}

export default UserReduxReducer