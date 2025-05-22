import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

import { io } from "socket.io-client";

import { uploadToCloudinary } from "../lib/Cloudinaryut";

const BASE_URL =  import.meta.env.MODE === "development" ? 'http://localhost:5000/' : "/";

export const useAuthStore = create((set ,get)=> ({
    authUser : null,// initial state of user

    isSigningUp : false , 
    isLoggingUp : false,
    isUpadtingProfile : false , 
    onlineUsers : [],
    socketState: null,
    receivedInvites: [],
    sentInvites: [],
    isLoadingInvites: false,
    isSendingInvite: false,


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

            set({ isUpadtingProfile: true});

            let profilePicUrl = data.profilePic; ; 

            if(data.profilePic && typeof data.profilePic !== 'string'){
                profilePicUrl = await uploadToCloudinary(data.profilePic);
            }

            // send only the url to backend 

            const res = await axiosInstance.put("/auth/update-profile",{
                profilePic : profilePicUrl
            });
            // update the authUser state with the new data
            set({ authUser: res.data});
            toast.success("Profile updated successfully");

       }catch(error){
            console.log("Error in updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }  finally{
            set({ isUpadtingProfile: false});
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
            const errorMessage = error.response?.data?.message || "Login failed";
            toast.error(errorMessage);

        }finally{
            set({ isLoggingUp : false});
        }
    },




     getReceivedInvites: async () => {
        try {
            set({ isLoadingInvites: true });
            const res = await axiosInstance.get("/invite/received");
            set({ receivedInvites: res.data });
        } catch (error) {
            console.error("Error fetching received invites:", error);
            toast.error("Failed to load invites");
        } finally {
            set({ isLoadingInvites: false });
        }
    },
    
    // Get sent invites
    getSentInvites: async () => {
        try {
            set({ isLoadingInvites: true });
            const res = await axiosInstance.get("/invite/sent");
            set({ sentInvites: res.data });
        } catch (error) {
            console.error("Error fetching sent invites:", error);
            toast.error("Failed to load sent invites");
        } finally {
            set({ isLoadingInvites: false });
        }
    },
    
    // Send invite
    sendInvite: async (username) => {
        try {
            set({ isSendingInvite: true });
            const res = await axiosInstance.post("/invite/send", { username });
            
            // Add new invite to sent invites
            set(state => ({ 
                sentInvites: [res.data, ...state.sentInvites] 
            }));
            
            toast.success("Invite sent successfully");
            return true;
        } catch (error) {
            console.error("Error sending invite:", error);
            toast.error(error.response?.data?.message || "Failed to send invite");
            return false;
        } finally {
            set({ isSendingInvite: false });
        }
    },
    
    // Accept the invite invite
    acceptInvite: async (inviteId) => {
        try {
            const res = await axiosInstance.put(`/invite/${inviteId}/accept`);
            
            // Update received invites list
            set(state => ({
                receivedInvites: state.receivedInvites.map(invite => 
                    invite._id === inviteId ? { ...invite, status: 'accepted' } : invite
                )
            }));
            
            toast.success("Invite accepted");
            return true;
        } catch (error) {
            console.error("Error accepting invite:", error);
            toast.error("Failed to accept invite");
            return false;
        }
    },
    
    // Reject  the invite
    rejectInvite: async (inviteId) => {
        try {
            await axiosInstance.put(`/invite/${inviteId}/reject`);
            
            // Update received invites list
            set(state => ({
                receivedInvites: state.receivedInvites.map(invite => 
                    invite._id === inviteId ? { ...invite, status: 'rejected' } : invite
                )
            }));
            
            toast.success("Invite rejected");
            return true;
        } catch (error) {
            console.error("Error rejecting invite:", error);
            toast.error("Failed to reject invite");
            return false;
        }
    },
    
    // Delete  the invite
    deleteInvite: async (inviteId, type) => {
        try {
            await axiosInstance.delete(`/invite/${inviteId}`);
            
            // Update appropriate invites list
            if (type === 'received') {
                set(state => ({
                    receivedInvites: state.receivedInvites.filter(invite => invite._id !== inviteId)
                }));
            } else {
                set(state => ({
                    sentInvites: state.sentInvites.filter(invite => invite._id !== inviteId)
                }));
            }
            
            toast.success("Invite deleted");
            return true;
        } catch (error) {
            console.error("Error deleting invite:", error);
            toast.error("Failed to delete invite");
            return false;
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


