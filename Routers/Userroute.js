const express = require('express');
const router = express.Router();
const isAuth = require('../Middlewares/isAuth.js')
const upload = require('../Middlewares/upload.js');
const { RegisterUser, LoginUser, LogoutUser,SendOtp,VerifyOtp,changePassword,editProfile} = require('../Controllers/usercontroller.js')
router.post("/Registration",RegisterUser)
router.post("/Login",LoginUser)
router.get("/Logout",LogoutUser)
router.post("/otp",isAuth,SendOtp)
router.post("/verify",isAuth,VerifyOtp)
router.post('/changepassword',isAuth,changePassword)
router.post('/editprofile',isAuth,upload.single('profileimg'),editProfile)
module.exports = {router};
