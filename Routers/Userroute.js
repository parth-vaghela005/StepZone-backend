const express = require("express");
const router = express.Router();
const {RegisterUser} = require('../Controllers/usercontroller.js');
router.post('/Registration', RegisterUser);
module.exports = {
    router
}
