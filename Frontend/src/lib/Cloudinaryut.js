import axios from 'axios';


export const uploadToCloudinary = async(file) => {
    try {
        const cloudName =  'dlghcqg7r'
        const uploadPreset = 'chat_app_preset'
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'chat_app_uploads');
        
        const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
        );
        
        return uploadResponse.data.secure_url;
    } catch(error) {
        console.log("Error in uploading to cloudinary:", error);
        throw new Error('Failed to upload image');
    }
};