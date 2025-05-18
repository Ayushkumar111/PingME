import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utlis'
import { useRef } from 'react'
import ImageLightbox from './ImageLightbox'
import { useState } from 'react'




const ChatContainer = () => {
  const { messages , getMessages , isMessageLoading , selectedUser  , subscribeToMessages , unsubscribeFromMessages } = useChatStore()
  const{authUser} = useAuthStore()
  const messageEndRef = useRef(null);

  const [ lightBox , setLightBox ] = useState({
    isOpen : false , 
    image : null 
  });

const openLightbox = ( image ) => {
  setLightBox({
    isOpen : true ,
    image : image
  });
};
  
const closeLightbox = () => {
  setLightBox({
    isOpen : false ,
    image : null
  });
  };


  useEffect(()=>{
    getMessages(selectedUser._id)
    subscribeToMessages();
    return()=>{
      unsubscribeFromMessages()
    }
  },[selectedUser._id , getMessages , subscribeToMessages , unsubscribeFromMessages]);


  useEffect(() => {
    if(messageEndRef.current && messages)
    messageEndRef.current.scrollIntoView({ bhehavior: "smooth" });
  }, [messages]);


  if(isMessageLoading) {
    return <div className='flex-1 flex flex-col overflow-auto'>
     <ChatHeader/>
     <MessageSkeleton/>
     <MessageInput/> 

  </div>
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>  

     <ChatHeader/>

      <div className='flex-1  overflow-y-auto p-4 space-y-4'>
        {messages.map((message) =>  (
          <div 
          key={message._id}
          className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
          ref={messageEndRef}>
  
  <div className="max-w-[60%]">
    <div className='flex items-end gap-2'>
      <div className='chat-image avatar'>
        <div className='size-10 rounded-full border'>
          <img 
            src={
              message.senderId === authUser._id 
                ? authUser.profilePic || "/assests.png"
                : selectedUser.profilePic || "/assests.png"
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
              className='sm:max-w-[200px] rounded-md mb-2'
              onClick={()=> openLightbox(message.image)}
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



      <MessageInput/> 

       {/* Lightbox Component */}
      {lightBox.isOpen && (
        <ImageLightbox 
          image={lightBox.image}
          alt="Message attachment"
          onClose={closeLightbox}
        />
      )}
    
    
    
  
    
    
    </div>

    
  )
}

export default ChatContainer
