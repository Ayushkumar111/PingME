import User from "../models/user.model.js";
import Invite from "../models/invite.model.js";


export const sendInvite = async( req , res )=>{
    try{
        const { username } = req.body;

        if(!username){
            return res.status(400).json({ message : " Username is required"})
        }

        const receiver = await User.findOne({ username });
        if(!receiver){
            return res.status(404).json({ message: "Username not found"})
        }

        const senderId = req.user._id;

        if( senderId.toString() === receiver._id.toString()){
            return res.status(400).json({ message: "You cannot send an invite to yourself"})
        }

        const existingInvite = await Invite.findOne({
            sender : senderId,
            receiver: receiver._id,
            status:{$in: [ 'pending' , 'accepted']}
        })

        if(existingInvite){
            return res.status(400).json({
                message : existingInvite.status === 'pending'?
                "Invite already sent"
                :"User is already in your contacts"
            });
        }

        const existingConnection = await Invite.findOne({
            sender : receiver._id,
            receiver: senderId,
            status:'accepted'
        });

        if(existingConnection){
            return res.status(400).json({message: "User is already in your contacts"})
        }

        // creating a new invite 

        const newInvite = new Invite({
            sender : senderId,
            receiver: receiver._id,
            status: 'pending'
        });

        await newInvite.save();

        // populating the sender details for the response , gets us username , profile pic for sender invite from the complete invite collection . 
        
        const populatedInvite = await Invite.findById(newInvite._id)
        .populate("sender", "username fullName profilePic")
        .populate("receiver", "username fullName profilePic");
        res.status(201).json(populatedInvite);

    }catch(error){
        console.log("Error in invite controller" , error.message);
        res.status(500).json({message : " internal server error"});
    }
}

// get all the recieved invites to you 

export const getReceivedInvites = async ( req , res)=>{
    try{
        const userId = req.user._id;

        const invites = await Invite.find({receiver: userId})
        .populate('sender', 'username fullName profilePic')
        .sort({ createdAt: -1});
        res.status(200).json(invites);
    }catch(error){
        console.log("Error in getReceivedInvites controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get all the invite sent by you 

export const getSentInvites = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const invites = await Invite.find({ sender: userId })
            .populate('receiver', 'username fullName profilePic')
            .sort({ createdAt: -1 });
        
        res.status(200).json(invites);
    } catch (error) {
        console.log("Error in getSentInvites controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// accepting a invite 
export const acceptInvite = async ( req , res)=>{
    try{

        const inviteId = req.params.id;
        const userId = req.user._id;

        const invite = await Invite.findById(inviteId);

        if(!invite){
            return res.status(404).json({message:"Invite does not exists"});
        }
        // check if the logged in person is the only guy who recieved the request , if not then one person can not accpt other person invite , hence written that u can only accpt urs invite not others 
        if (invite.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only accept invites sent to you" });
        }

        invite.status = 'accepted';
        await invite.save();

        const populatedInvite = await Invite.findById(inviteId)
            .populate('sender', 'username fullName profilePic')
            .populate('receiver', 'username fullName profilePic');
        
        res.status(200).json(populatedInvite);



    }catch(error){
          console.log("Error in acceptInvite controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// rejecitng n invite 

export const rejectInvite = async (req, res) => {
    try {
        const inviteId = req.params.id;
        const userId = req.user._id;
        
        const invite = await Invite.findById(inviteId);
        
        if (!invite) {
            return res.status(404).json({ message: "Invite not found" });
        }
        
        // Verify this invite is for the current user
        if (invite.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only reject invites sent to you" });
        }
        
        invite.status = 'rejected';
        await invite.save();
        
        res.status(200).json({ message: "Invite rejected successfully" });
    } catch (error) {
        console.log("Error in rejectInvite controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// deleting n invite 

export const deleteInvite = async (req, res) => {
    try {
        const inviteId = req.params.id;
        const userId = req.user._id;
        
        const invite = await Invite.findById(inviteId);
        
        if (!invite) {
            return res.status(404).json({ message: "Invite not found" });
        }
        
        // Verify user has permission to delete this invite (either sender or receiver)
        if (invite.sender.toString() !== userId.toString() && 
            invite.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You don't have permission to delete this invite" });
        }
        
        await Invite.findByIdAndDelete(inviteId);
        
        res.status(200).json({ message: "Invite deleted successfully" });
    } catch (error) {
        console.log("Error in deleteInvite controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get user contacts (accepted invites where user is either sender or receiver)
export const getContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find all accepted invites where the user is either sender or receiver
        const sentInvites = await Invite.find({
            sender: userId,
            status: 'accepted'
        }).populate('receiver', 'username fullName profilePic');
        
        const receivedInvites = await Invite.find({
            receiver: userId,
            status: 'accepted'
        }).populate('sender', 'username fullName profilePic');
        
        // Extract and combine unique contacts
        const sentContacts = sentInvites.map(invite => invite.receiver);
        const receivedContacts = receivedInvites.map(invite => invite.sender);
        
        const contacts = [...sentContacts, ...receivedContacts];
        
        res.status(200).json(contacts);
    } catch (error) {
        console.log("Error in getContacts controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};