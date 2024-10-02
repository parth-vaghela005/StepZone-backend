const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js'); // Adjust path as needed
const { createProduct } = require('../Controllers/productcontroller.js');
const { RegisterUser, LoginUser, LogoutUser} = require('../Controllers/usercontroller.js')
router.post("/Registration",RegisterUser)
router.post("/Login",LoginUser)
router.get("/Logout",LogoutUser)
router.post('/create', 
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, 
        { name: 'additionalImages', maxCount: 5 }
    ]), 
    createProduct
);
module.exports = {router};
