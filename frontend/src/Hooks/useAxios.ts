import axios from "axios";
import Cookies from "js-cookie";
import { REACT_APP_BASEURL } from "../config";

const token = Cookies.get("token")

const instance = axios.create({
    baseURL: REACT_APP_BASEURL,
    withCredentials: true,
    headers: {
        Authorization: `${token}`
    }
});

export default instance;
