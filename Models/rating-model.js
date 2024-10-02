const mongoose = require('mongoose');
const RatingSchema = new mongoose.Schema({
    stars: {
        type: Number,          // Star rating (1 to 5)
        required: false,
        min: 1,                // Minimum value for stars
        max: 5,                // Maximum value for stars
    },
    description: {
        type: String,          // Optional description of the rating
        trim: true,            // Trims whitespaces from the description
        maxlength: 500         // Limits the description to 500 characters
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the user who gave the rating
        ref: 'User',                           // Assuming there's a User model
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the product being rated
        ref: 'Product',                        // Assuming there's a Product model
    },
    createdAt: {
        type: Date,
        default: Date.now,      // Automatically set the creation date
    }
});
const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating


