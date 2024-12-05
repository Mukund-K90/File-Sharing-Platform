const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    sharedFiles: [
        {
            fileId: mongoose.Schema.Types.ObjectId,
            url: String,
            sharedBy: {
                name: String,
                id: mongoose.Schema.Types.ObjectId,
                email: String,
                sharedDate: {
                    type: Date,
                },
            },

        }
    ],
    plan: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
