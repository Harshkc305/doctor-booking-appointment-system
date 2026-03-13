import axios from 'axios';


let baseURL="http://localhost:2512/api";

let axiosInstance=axios.create({baseURL,withCredentials:true})

axiosInstance.interceptors.request.use()




export default axiosInstance