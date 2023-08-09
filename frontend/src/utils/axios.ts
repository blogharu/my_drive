import axios from "axios"
import { access } from "fs"
import { Cookies } from "react-cookie"
import Toasts from "./toasts"

const axiosLogin = (access_token: string) => {
    axios.defaults.headers.common.Authorization = `Bearer my_drive ${access_token}`
}

const axiosLogout = () => {
    axios.defaults.headers.common.Authorization = null
}


const getAxiosInit = () => {
    let isRun = false
    const axiosInit = (access_token?: string) => {
        if (isRun === false) {
            axios.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
            if (access_token) {
                axiosLogin(access_token)
            }
            axios.interceptors.response.use(null, (error) => {
                if (error.response.status === 400) {
                    Toasts.errorResponse(error)
                }
                return Promise.reject(error)
            })
            isRun = true
        }
    }
    return axiosInit
}
let axiosInit = getAxiosInit()

export { axiosLogin, axiosLogout, axiosInit }