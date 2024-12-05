const express = require('express');
const router = express.Router();
const { authentication } = require('../../middleware/auth.middleware');
const UploadModel = require('../../model/file');
const { getFileUrl } = require('../../utils/upload');
const User = require('../../model/user');

// Welcome Page
router.get('/', (req, res) => {
    const userData = {};
    res.render('welcome', { userData });
});


// Login
router.get('/login', (req, res) => {
    const messages = req.flash();
    const userData = messages.userData ? messages.userData[0] : {};

    return res.render('login', { messages, userData });
});

//profile
router.get('/profile', authentication, (req, res) => {
    const userData = req.user || null;

    return res.render('profile', { user: userData });
});

// Sign Up
router.get('/register', (req, res) => {
    const messages = req.flash();

    const userData = messages.userData ? messages.userData[0] : {};
    return res.render('register', { messages, userData });
});

// Home Page
router.get('/home', authentication, (req, res) => {
    const messages = req.flash();
    const userData = req.user || null;

    return res.render('home', { user: userData, messages });
});


router.get('/logout', (req, res) => {
    const messages = req.flash();
    const userData = messages.userData ? messages.userData[0] : {};

    return res.render('login', { messages, userData });
});

router.get('/my-uploads', authentication, async (req, res) => {
    try {
        const user = req.user || null;
        const userFiles = await UploadModel.find({ userId: user._id });

        res.render('my-uploads', { uploads: userFiles });
    } catch (error) {
        console.error('Error fetching uploads:', error);
        res.status(500).send('Error fetching uploads');
    }
});

router.get('/shared-files', authentication, async (req, res) => {
    try {
        const user = req.user || null;
        let files = [];

        if (user.sharedFiles.length !== 0) {
            for (const sharedFile of user.sharedFiles) {
                const file = await UploadModel.findById(sharedFile.fileId);
                if (file) {
                    files.push({
                        file,
                        sharedBy: sharedFile.sharedBy
                    });
                }
            }
        }

        if (user) {
            res.render('shared-files', { uploads: files });
        }

        res.render('home', { messages: req.flash() });


    } catch (error) {
        console.error('Error fetching uploads:', error);
        res.status(500).send('Error fetching uploads');
    }
});





module.exports = router;
