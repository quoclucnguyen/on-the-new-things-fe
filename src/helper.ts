import localForage from "localforage";
import {UserLogin} from "./App";

export const getUserLogin = () => {
    return localForage.getItem<UserLogin>('user').then(result => result);
}