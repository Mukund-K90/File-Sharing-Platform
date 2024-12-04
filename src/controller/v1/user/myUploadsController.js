
const { fileUpload, getFileUrl, signedUrl } = require('../../../utils/upload');
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

        // Calculate file size
        const sizeInKB = fileMetadata.size / 1024;
        const size = sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(2)} KB`;

        const uploadResult = await fileUpload(filePath, resourceType, `files/${fileName}`);
        if (!uploadResult) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.NOT_UPLOAD);
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
        res.redirect('/home?tab=my-uploads');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
};

//share file
exports.shareFile = async (req, res) => {
    const user = req.user || null;

    const { email, fileId } = req.body;

    try {
        const recipient = await User.findOne({ email });
        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient not found' });
        }

        const file = await UploadModel.findOne({ title: fileId });

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        recipient.sharedFiles = recipient.sharedFiles || [];
        recipient.sharedFiles.push({
            fileId: file._id,
            url: file.url,
            sharedBy: {
                name: user.name,
                id: user._id,
                email: user.email,
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
            <a href="{{web_link}}" class="btn" target="_blank">Open File</a>
        </div>
        <div class="email-footer">
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`
        const isMail = await mailService(email, "File Shared", htmlMsg);
        
    } catch (err) {
        console.error('Error sharing file:', err);
        res.status(500).json({ success: false, message: 'An error occurred while sharing the file.' });
    }
}

//delete file
exports.deleteFile = async (req, res) => {
    try {
        fileId = req.params.fileId;
        const deleteFile = await UploadModel.findByIdAndDelete(fileId);
        if (!deleteFile) {
            req.flash('error', "File Not Deleted")
            res.redirect('/home?tab=my-uploads');
        }
        req.flash('success', "File Deleted Successfully")
        res.redirect('/home?tab=my-uploads');
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}