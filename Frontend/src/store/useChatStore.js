import { create } from "zustand";
import toast from 'react-hot-toast';
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { uploadToCloudinary } from "../lib/Cloudinaryut";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      messagesByUserId: {
        // userId: [messages]
      },
      users: [],
      selectedUser: null,
      isUserLoading: false,
      isMessageLoading: false,
      isSendingMessage: false,

      // Fetches all user contacts
      getUsers: async () => {
        set({ isUserLoading: true });

        try {
          const res = await axiosInstance.get("/invite/contacts");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
          set({ isUserLoading: false });
        }
      },

      // Fetch messages for a specific user
      getMessages: async (userId) => {
       
        set({ isMessageLoading: true });
        try {
          const res = await axiosInstance.get(`/message/${userId}`);
         
          set(state => {
            const newMessagesByUserId = {
              ...state.messagesByUserId,
              [userId]: res.data // This overwrites
            };
           
            return {
              messagesByUserId: newMessagesByUserId
            };
          });
        } catch (error) {
         
          toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
          set({ isMessageLoading: false });
        }
      },

      // Send message (text + optional image)
      sendMessage: async (text, selectedImage, receiverId) => {
        
        try {
          set({ isSendingMessage: true });
          let imageUrl = null;
          if (selectedImage) {
            imageUrl = await uploadToCloudinary(selectedImage);
          }
          const res = await axiosInstance.post(`/message/send/${receiverId}`, {
            text,
            image: imageUrl,
          });
         

          set(state => {
            const updatedMessages = [
              ...(state.messagesByUserId[receiverId] || []),
              res.data
            ];
            
            const newMessagesByUserId = {
              ...state.messagesByUserId,
              [receiverId]: updatedMessages
            };
            
            return { messagesByUserId: newMessagesByUserId };
          });

        } catch (error) {
          
          toast.error(error.response?.data?.message || "Failed to send message");
        } finally {
          set({ isSendingMessage: false });
        }
      },

      // Listen for incoming messages via socket
      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socketState;
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
          if (newMessage.senderId !== selectedUser._id) return;

          set(state => ({
            messagesByUserId: {
              ...state.messagesByUserId,
              [selectedUser._id]: [
                ...(state.messagesByUserId[selectedUser._id] || []),
                newMessage
              ]
            }
          }));
        });
      },

      // Unsubscribe from new message updates
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socketState;
        socket.off("newMessage");
      },

      // Sets the currently selected chat user and initializes message loading
      setSelectedUser: (selectedUser) => {
        set({ selectedUser });

        if (selectedUser) {
          const existingMessages = get().messagesByUserId[selectedUser._id];

          if (!existingMessages || existingMessages.length === 0) {
            get().getMessages(selectedUser._id);
          }

          get().subscribeToMessages();
        }
      },

      // REMOVED: The problematic getter has been removed
      // Instead, components should access messages directly via the selector

      // Initializes message fetch and subscription on mount
      initializeChat: () => {
        const { selectedUser } = get();

        if (selectedUser) {
          const existingMessages = get().messagesByUserId[selectedUser._id];

          if (!existingMessages || existingMessages.length === 0) {
            get().getMessages(selectedUser._id);
          }

          get().subscribeToMessages();
        }
      }
    }),

    // Zustand Persist Config
    {
      name: "chat-storage",
      partialize: (state) => ({
        selectedUser: state.selectedUser,
        messagesByUserId: state.messagesByUserId,
      }),
    }
  )
);