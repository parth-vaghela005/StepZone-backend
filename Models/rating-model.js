const mongoose = require('mongoose');
const RatingSchema = new mongoose.Schema({
    stars: {
        type: Number,         
        required: false,
        min: 1,             
        max: 5,              
    },
    description: {
        type: String,          
        trim: true,          
        maxlength: 500         
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',                  
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',                       
    },
    createdAt: {
        type: Date,
        default: Date.now,      
    }
});
const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating


