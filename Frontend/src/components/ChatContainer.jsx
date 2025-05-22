import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './Skeletons/MessageSkeleton';
import { formatMessageTime } from '../lib/utlis';
import ImageLightbox from './ImageLightbox';

const ChatContainer = () => {
  const { 
    getMessages, 
    isMessageLoading, 
    subscribeToMessages, 
    unsubscribeFromMessages, 
    initializeChat 
  } = useChatStore();

  // Fixed: Access messages directly from messagesByUserId instead of using the removed getter
  const selectedUser = useChatStore(state => state.selectedUser);
  const messagesByUserId = useChatStore(state => state.messagesByUserId);
  
  // Get messages for the selected user
  const messages = selectedUser ? messagesByUserId[selectedUser._id] || [] : [];
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

 
  const [lightBox, setLightBox] = useState({
    isOpen: false,
    image: null
  });

  const openLightbox = (image) => {
    setLightBox({
      isOpen: true,
      image
    });
  };

  const closeLightbox = () => {
    setLightBox({
      isOpen: false,
      image: null
    });
  };

  // Fetch and subscribe to messages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      // Only fetch messages if we don't have any for this user
      const existingMessages = messagesByUserId[selectedUser._id];
      if (!existingMessages || existingMessages.length === 0) {
        getMessages(selectedUser._id);
      }
      subscribeToMessages();

      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser, messagesByUserId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Loading state
  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>  
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="max-w-[60%]">
              <div className='flex items-end gap-2'>
                <div className='chat-image avatar'>
                  <div className='size-10 rounded-full border'>
                    <img
                      src={
                        message.senderId === authUser._id 
                          ? authUser.profilePic || "/assests.png"
                          : selectedUser?.profilePic || "/assests.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <div>
                  <div className='chat-header mb-1'>
                    <time className='text-xs opacity-50'>
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>

                  <div className={`p-2 rounded-lg ${message.senderId === authUser._id ? 'bg-indigo-400 text-white' : 'bg-gray-300 text-black'}`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className='sm:max-w-[200px] rounded-md mb-2 cursor-pointer'
                        onClick={() => openLightbox(message.image)}
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {/* Lightbox Component */}
      {lightBox.isOpen && (
        <ImageLightbox 
          image={lightBox.image}
          alt="Message attachment"
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default ChatContainer;