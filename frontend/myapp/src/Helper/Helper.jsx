import axios from 'axios';


let baseURL="http://localhost:2512/api";

let axiosInstance=axios.create({baseURL,withCredentials:true})

axiosInstance.interceptors.request.use(
    async(config)=>{
        const token=localStorage.getItem("token");
        if(token){
            config.headers.Authorization=token;
        }
        return config;
    },
    function(error){
        return Promise.reject(error)
    }
)




export default axiosInstance