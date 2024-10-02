const express = require("express");
const router = express.Router();
const {RegisterUser,LoginUser,LogoutUser} = require('../Controllers/usercontroller.js');
router.post('/Registration', RegisterUser);
router.post('/Login', LoginUser);
router.get('/Logout',LogoutUser)
module.exports = {
    router
}
