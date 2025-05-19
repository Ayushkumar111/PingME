import { create } from "zustand";
import toast from 'react-hot-toast';
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { uploadToCloudinary } from "../lib/Cloudinaryut";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isSendingMessage: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (text , selectedImage , receiverId) => {
        const {  messages } = get();
        try {
            set({ isSendingMessage: true });

            let imageUrl = null;
            

            if(selectedImage) {
                imageUrl = await uploadToCloudinary(selectedImage);
            }



            const res = await axiosInstance.post(`/message/send/${receiverId}`, {
                text,
                image: imageUrl,
            });
            set({ messages: [...messages, res.data] });

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }finally{
            set({ isSendingMessage: false });
        }
    },


    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return ; 
        
        const socket = useAuthStore.getState().socketState;
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return ; 
            set({messages:[...get().messages,newMessage] })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socketState;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
