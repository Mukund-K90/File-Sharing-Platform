const multer = require('multer');
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, '..', "upload");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure Multer storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir); // Temporary folder for file storage
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

// Multer file filter (to validate file types)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|bmp|webp|tiff|mp4|mkv|avi|mov|wmv|flv|webm|mp3|wav|aac|ogg|flac|m4a|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|zip|rar|7z|tar|gz|exe|msi|sh|bat|apk|js|json|html|css|py|java|cpp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

// Multer instance
exports.upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    fileFilter,
}).fields(([
    { name: "file", maxCount: 1 }
]));
