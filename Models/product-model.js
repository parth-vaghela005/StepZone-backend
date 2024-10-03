const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    path: {
        type: String,
    },
    images: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        required: true,
        default: "",
    },
    price: {
        type: Number, // Change to Number if this field represents a price
        required: true, // Consider making price required if applicable
        default: 0, // Set default to 0 if you want to ensure there's always a numeric value
    },
    category: {
        type: String,
        default: "",
    },
    brand: {
        type: String,
        default: "",
    },
    color: {
        type: String,
        required:true
    },
    size: {
        type: String,

    },
    rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
    }]
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
