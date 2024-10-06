const express = require('express')
const {createProduct,getProductById,ProductFiltering,getAllProducts} = require('../Controllers/productcontroller.js')
const isAuth = require('../Middlewares/isAuth.js')
const {AddReview} = require('../Controllers/Ratingcontroller.js')
const upload = require('../utils/upload.js'); 
const {AddtoCart,RemovetoCart} = require('../Controllers/cartcontroller.js')
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
productrouter.get('/',getAllProducts)
productrouter.post('/filter', ProductFiltering);
productrouter.post('/cart/:id',isAuth,AddtoCart)
productrouter.delete('/remove/:id',isAuth,RemovetoCart)
module.exports = productrouter