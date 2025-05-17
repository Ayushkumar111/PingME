import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL : import.meta.env.MODE === "devlopment" ?  "http://localhost:5000/api": "/api",
    withCredentials: true, // sending cookies everytime for security 
});