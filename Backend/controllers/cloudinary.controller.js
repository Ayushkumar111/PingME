import crypto from 'crypto'; 
  // this was used for signed upload request but now wer are using unsigned uploade preset so we dont neet this function , use for future purposes 
export const generateSignature = (req ,res)=>{
    try{
        const timestamp = Math.round(new Date().getTime()/1000);
        const apiSecert = process.env.CLOUDINARY_API_SECRET;


         // Add debugging
        console.log("API Key from env:", process.env.CLOUDINARY_API_KEY);
        console.log("Cloud name from env:", process.env.CLOUDINARY_CLOUD_NAME);

        const stringToSign = `folder=chat_app_uploads&timestamp=${timestamp}${apiSecert}`;

        const signature = crypto
        .createHash('sha1')
        .update(stringToSign)
        .digest('hex');

        res.status(200).json({
            signature , 
            timestamp,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME 
        });
    }catch(error){
        console.log('Error in geneerating signature:', error);
        res.status(500).json({message :'Failed to generate signature'});
    }
};