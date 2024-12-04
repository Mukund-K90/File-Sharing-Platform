const { CONFIG } = require('../config/config');
const cloudinary = require('cloudinary');

// Configuration
cloudinary.config({
    cloud_name: CONFIG.cloudName,
    api_key: CONFIG.cloudinaryApiKey,
    api_secret: CONFIG.cloudinaryApiSecret
});

//file upload
exports.fileUpload = async (file, type, filename) => {
    const result =
        cloudinary.v2.uploader
            .upload(file,
                {
                    resource_type: type,
                    public_id: filename,
                })
            .catch((error) => {
                console.log(error);
            });
    return result;
}

//get file url
exports.getFileUrl = (fileName) => {
    cloudinary.api.resource(`files/${fileName}`, function (result) {
        console.log(result);
        const imageUrl = result.url;
        console.log("Image URL:", imageUrl);
    });
};



//delete file
exports.deleteFile = async (publicId) => {
    console.log(`files/${publicId}`);
    
    return await cloudinary.uploader.destroy(`files/${publicId}`);
}