const express = require('express');
const router = express.Router();
const { upload } = require('../../utils/multer');
const { fileUpload, shareFile, downloadFile, deleteFile } = require('../../controller/v1/user/myUploadsController');
const { authentication } = require('../../middleware/auth.middleware');

router.post('/upload', authentication, upload, fileUpload);  // POST route for uploading files
router.post('/share', authentication, shareFile);
router.delete('/delete-file/:fileId', authentication, deleteFile);

module.exports = router;
