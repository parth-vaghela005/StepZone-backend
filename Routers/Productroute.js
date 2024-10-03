const express = require('express')
const {createProduct,getProductById,ProductFiltering} = require('../Controllers/productcontroller.js')
const isAuth = require('../Middlewares/isAuth.js')
const {AddReview} = require('../Controllers/Ratingcontroller.js')
const upload = require('../utils/upload.js'); 
const productrouter = express.Router()
productrouter.post('/add', 
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, 
        { name: 'additionalImages', maxCount: 5 }
    ]), isAuth,
    createProduct
);
productrouter.post('/:id/review',isAuth,AddReview)
productrouter.get('/:id',getProductById)
productrouter.get('/filter', ProductFiltering);
module.exports = productrouter