const express = require('express');
const { userSignUp, userLogin, userLogOut, userRegister } = require('../../controller/v1/user/userController');
const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);

module.exports = router;