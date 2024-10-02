const express = require("express");
const router = express.Router();
const {RegisterUser,LoginUser} = require('../Controllers/usercontroller.js');
router.post('/Registration', RegisterUser);
router.post('/Login', LoginUser);
module.exports = {
    router
}
