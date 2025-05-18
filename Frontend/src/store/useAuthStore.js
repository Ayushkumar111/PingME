import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.MODE === "development" ? 'http://localhost:5000/' : "/";

export const useAuthStore = create((set ,get)=> ({
    authUser : null,// initial state of user

    isSigningUp : false , 
    isLoggingUp : false,
    isUpadtingProfile : false , 
    onlineUsers : [],
    socketState: null,






    isCheckingAuth : true, // loading state

    CheckAuth : async() =>{
        try{
          const res = await axiosInstance.get("/auth/check");
         set({ authUser : res.data});
         get().connectSocket();
        }catch(error)
        {
            console.log("Error in CheckAuth:", error);
            set({authUser : null});
       
        }finally {
            set({isCheckingAuth : false});
        }
    },

    signup : async(data)=>{
        set({ isSigningUp : true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            
            // Check if response exists and has data property
            if (res && res.data) {
                set({ authUser : res.data});
                toast.success("Account created successfully");
                get().connectSocket();
            } else {
                throw new Error("Invalid response from server");
            }
        }catch(error){
            console.error("Signup error:", error);
            // More robust error handling
            const errorMessage = error.response?.data?.message || "Error signing up";
            toast.error(errorMessage);
        }finally{
            set({ isSigningUp : false});
        }
    },

    logout : async() =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({ authUser : null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }

    },

    updateProfile : async(data)=> {
        try{
            set({ isUpdatingProfile : true});
            const res = await axiosInstance.put("/auth/update-profile" , data);
            set({ authUser : res.data});
            toast.success("Profile updated successfully");

        }catch(error){
            console.log("Error in updateProfile:", error);
            toast.error(error.response.data.message);

        }finally{
            set({isUpdatingProfile : false});
        }
    },


    login : async(data)=>{
        set({ isLoggingUp : true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser : res.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        }catch ( error){
            console.error("Login error:", error);
            toast.error(error.response.data.message);

        }finally{
            set({ isLoggingUp : false});
        }
    },

   connectSocket:() =>{
    const { authUser} = get();
    if(!authUser || get().socket?.connected) return; 


   const socket = io(BASE_URL, {
    query:{
        userId: authUser._id,
    },
     withCredentials: true,
   });
    set({ socketState : socket});

    socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers : userIds});
    })


   }, 


   disconnectSocket:() =>{

    if(get().socketState?.connected) get().socketState.disconnect();
    set({ socketState : null});

   },
}));


