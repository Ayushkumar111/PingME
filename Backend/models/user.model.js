import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLenght: 3 ,
            maxLenght: 21,
        },
        fullName:{
            type: String,
            required: true ,
        },
        password:{
            type: String,
            required: true,
            minLenght: 6
        },
        profilePic:{
            type:String,
            default:""
        },
    },
        {
            timestamps: true
        }
    
);

const User = mongoose.model('User', userSchema);
export default User ;