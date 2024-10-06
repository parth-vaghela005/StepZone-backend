const express = require('express');
const router = express.Router();
const isAuth = require('../Middlewares/isAuth.js')
// const { createProduct } = require('../Controllers/productcontroller.js');
const { RegisterUser, LoginUser, LogoutUser,SendOtp,VerifyOtp} = require('../Controllers/usercontroller.js')
router.post("/Registration",RegisterUser)
router.post("/Login",LoginUser)
router.get("/Logout",LogoutUser)
router.post("/otp",isAuth,SendOtp)
router.post("/verify",isAuth,VerifyOtp)
router.post('/changepassword',isAuth,changePassword)
module.exports = {router};
