const express = require('express');
const router = express.Router();
const { upload } = require('../../utils/multer');
const { fileUpload, shareFile, downloadFile, deleteFile, deleteAfterDownload } = require('../../controller/v1/user/myUploadsController');
const { authentication } = require('../../middleware/auth.middleware');

router.post('/upload', authentication, upload, fileUpload);  // POST route for uploading files
router.post('/share', authentication, shareFile);
router.delete('/delete-file/:file', authentication, deleteFile);
router.post('/delete-after-download/:fileName', authentication, deleteAfterDownload);


module.exports = router;
