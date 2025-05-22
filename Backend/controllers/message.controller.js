import User from '../models/user.model.js';
import Message from '../models/message.model.js';

import { getReceiverSocketId, io } from '../lib/Socket.js';

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id:{ $ne: loggedUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Get users for sidebar error:", error.message);
        res.status(500).json({message: "Server error"});
    }
};


export const getMessages = async (req, res) => {
    try{

        const { id: userToChatId} = req.params; //req.params Express.js ka object hai jo URL ke andar jo bhi parameters diye gaye hain unko capture karta hai. Dynamic Part: Jab koi user kisi doosre user ke saath chat open karega, toh URL me ek unique id aayegi jo us receiver user ki ID hogi.
        const myId = req.user._id; //geting my id from protected route 

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId : userToChatId } , //person where either i am the sender & he is reciver or vice versa 
                {senderId: userToChatId, receiverId : myId}
            ] 
        })

        res.status(200).json(messages);
    }catch(error){
        console.log("Get messages error:", error.message);
        res.status(500).json({message: "Server error"});

    }
};

export const sendMessage = async ( req, res) =>{
    try{

        console.log("Request body:", req.body);
        console.log("Receiver ID from params:", req.params.id);

        const { text , image } = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }






        // no need to upload to cloudinary , we are getting url from client 
        const newMessage = new Message({
            senderId,
            receiverId,
            text: typeof text === "string" ? text : null, // check if text is string
            image: typeof image == 'string'? image:null , // direct url of image from cloudinary 
        });

        await newMessage.save();

        //to do real time update feautre using socket.io

         const receiverSocketId = getReceiverSocketId(receiverId); // get the socket id of the receiver
         if(receiverSocketId){
            io.to(receiverSocketId.emit("newMessage" , newMessage));
         }


        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Send message error:", error.message);
        res.status(500).json({message: "Server error"});

    }
 





   
};
