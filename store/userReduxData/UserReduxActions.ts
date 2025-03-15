import { UserModel } from "@/models/UserModel";
import UserReduxTypes from "./UserReduxTypes";

export const getUser = () => {
    return {
        type: UserReduxTypes.GetUser
    }
}

export const setUser = (user: UserModel) => {
    return {
        type: UserReduxTypes.SetUser,
        data: user
    }
}