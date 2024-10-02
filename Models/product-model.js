const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    img:[
        {
            type:String,
            required:true
        },
        {
            type:String,
            required:true
        },
        {
            type:String,
            required:true
        },
    ],
    description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: number,
        required: false
    },
    rating: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Rating"
        
    }
});
 const Product = mongoose.model("Product", ProductSchema)
 module.exports = Product
