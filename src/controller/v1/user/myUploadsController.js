
const { fileUpload, getFileUrl, signedUrl, deleteFile } = require('../../../utils/upload');
const UploadModel = require('../../../model/file');
const { default: status } = require('http-status');
const { errorResponse } = require('../../../utils/apiResponse');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const User = require('../../../model/user');
const axios = require('axios');
const { mailService } = require('../../../utils/sendMail');


//file upload
exports.fileUpload = async (req, res) => {
    try {
        const user = req.user || null;
        if (!req.files || !req.files.file || !req.files.file[0]) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGE.NOT_FILE);
        }


        const fileMetadata = req.files.file[0];
        const filePath = fileMetadata.path;
        const fileName = fileMetadata.filename.split('.')[0];
        const mimetype = fileMetadata.mimetype;
        const resourceType = mimetype.startsWith('image/')
            ? 'image'
            : mimetype.startsWith('video/')
                ? 'video'
                : 'raw';

        if ((resourceType === "image" || resourceType === "raw") && fileMetadata.size > 10485760) {
            console.log("BIG");
            req.flash("error", "File is must be less than or equal to 10MB");
            res.redirect('/home');
        }
        if (resourceType === "video" && fileMetadata.size > 104857600) {
            console.log("BIG");
            req.flash("error", "Video is must be less than or equal to 100MB");
            res.redirect('/home');
        }
        // Calculate file size
        const sizeInKB = fileMetadata.size / 1024;
        const size = sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(2)} KB`;

        const uploadResult = await fileUpload(filePath, resourceType, `files/${fileName}`);
        if (!uploadResult) {
            req.flash("error", "File Not Uploaded");
            res.redirect('/home');
        }
        const uploadData = {
            url: uploadResult.url,
            asset_id: uploadResult.asset_id,
            title: fileName,
            type: mimetype,
            size,
            uploadedAt: new Date().toISOString(),
            userId: user._id,
        };

        const upload = new UploadModel(uploadData);
        await upload.save();

        req.flash('success', "File Uploaded Successfully")
        return res.redirect('/home');
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).send('Error uploading file');
    }
};

//share file
exports.shareFile = async (req, res) => {
    const user = req.user || null;

    const { email, fileId } = req.body;

    try {
        const recipient = await User.findOne({ email });
        if (!recipient) {
            req.flash('error', "User Not found");
            return res.redirect('/home');
        }

        const file = await UploadModel.findOne({ title: fileId });

        if (!file) {
            req.flash('error', "File Not Found");
            return res.redirect('/home');
        }
        recipient.sharedFiles = recipient.sharedFiles || [];
        recipient.sharedFiles.push({
            fileId: file._id,
            url: file.url,
            sharedBy: {
                name: user.name,
                id: user._id,
                email: user.email,
                sharedDate: Date.now()
            },
        });
        await recipient.save();
        const htmlMsg = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Shared Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header h1 {
            font-size: 24px;
            color: #333333;
        }
        .email-body {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
            text-align: center;
        }
        .email-body p {
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            padding: 12px 24px;
            margin-top: 20px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>File Shared with You</h1>
        </div>
        <div class="email-body">
            <p>Hello,</p>
            <p><strong>${user.name}</strong> has shared a file with you.</p>
            <p>Click the button below to view the file:</p>
            <a href="https://file-sharing-platform-bfzs.onrender.com" class="btn" target="_blank">Open File</a>
        </div>
        <div class="email-footer">
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`
        const isMail = await mailService(email, "File Shared", htmlMsg);
        req.flash('success', "File Shared Successfully");
        return res.redirect('/home');
    } catch (err) {
        console.error('Error sharing file:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while sharing the file.' });
    }
}

//delete file
exports.deleteFile = async (req, res) => {
    try {
        const fileName = req.params.file;        
        const isDelete = await deleteFile(fileName);
        if (!isDelete) {
            req.flash('error', "File Not Deleted")
            return res.redirect('/home');
        }        
        await UploadModel.findOneAndDelete({ title: fileName });
        req.flash('success', "File Deleted Successfully")
        return res.redirect('/home');
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}


exports.deleteAfterDownload = async (req, res) => {
    try {

        const userId = req.user._id;
        const { fileName } = req.params;
        const mainFile = await UploadModel.findOne({ title: fileName });


        const user = await User.findOne({ _id: userId });
        if (!user) {
            req.flash('error', "User Not Found")
            res.redirect('/home');
        }
        const fileIndex = user.sharedFiles.findIndex(
            (file) =>
                file.fileId === mainFile._id
        );
        const isDelete = await deleteFile(fileName);
        if (isDelete) {
            if (fileIndex === -1) {
                user.sharedFiles.splice(fileIndex, 1);
                await user.save();
            }
        }
        req.flash('success', "File Downloaded")
        return res.redirect('/home');
    } catch (error) {
        console.error('Error during file deletion:', error.message);
        res.status(500).send('Error occurred while deleting the file.');
    }
};