const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const UploadModel = mongoose.model('Upload', uploadSchema);

module.exports = UploadModel;
