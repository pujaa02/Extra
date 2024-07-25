/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { removerestid, removeuser, unvisible } from "../components/Store/Reducers/actions";
import Cookies from "js-cookie";
import { NavigateFunction } from 'react-router-dom';

export const handleError = (error: any, dispatch: Dispatch, navigate: NavigateFunction) => {
    if (error.message === "Request failed with status code 404") {
        dispatch(removeuser());
        dispatch(unvisible());
        dispatch(removerestid())
        Cookies.remove("token");
        navigate("/login");
    } else {
        console.error("Unhandled error:", error);
    }
};