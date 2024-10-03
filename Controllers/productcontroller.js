const cloudinary = require('../utils/cloudinary.js'); // Adjust the path as needed
const Product = require('../Models/product-model.js');
const createProduct = async (req, res) => {
    try {
        if(req.user.role  !== "seller"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized to perform this action"
            })
        }
        const { title, description, price, brand, category,color,size } = req.body;
        const mainImage = req.files.mainImage; // The main image uploaded
        const additionalImages = req.files.additionalImages; 
        if (!mainImage) {
            return res.status(400).json({ success: false, message: "Please upload a main image." });
        }
        const mainImageResponse = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                console.error("Error uploading main image:", error);
                return res.status(500).json({ success: false, message: "Failed to upload main image." });
            }
            return result;
        });

        // Convert the Buffer to Cloudinary upload
        const mainImagePath = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            });
            stream.end(mainImage[0].buffer); // Send the Buffer to Cloudinary
        });

        // Upload additional images to Cloudinary
        const images = [];
        if (additionalImages && additionalImages.length > 0) {
            for (const image of additionalImages) {
                const additionalImagePath = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(image.buffer); // Send the Buffer to Cloudinary
                });
                images.push(additionalImagePath);
            }
        }

        // Create new product in the database
        const product = await Product.create({
            title,
            description,
            price,
            brand,
            category,
            color,
            size,
            path: mainImagePath, // Store the main image URL
            images, // Store the additional image URLs
        });

        // Prepare the response
        const response = {
            success: true,
            message: "Product created successfully!",
            product: {
                id: product._id,
                title,
                description,
                path: mainImagePath,
                price,
                brand,
                category,
                images,
                color,
                size
            },
        };

        return res.status(201).json(response);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
const getProductById  = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'rating', 
                populate: { 
                    path: 'user', 
                    select: 'name email' 
                }
            });
        if(!product) 
        return res.status(404).json({ success: false, message:  "Product not found" });
     return res.status(201).json({
        success: true,
        message:"Product fetched successfully",
        product: product
     })
    } catch (error) {
        console.error("Error  on getting product:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
const ProductFiltering = async (req, res) => {
    try {
        const { color, size, category, brand, price } = req.query;
        const data = {};
        if (color) {
            console.log(color);
               const colorArray = Array.isArray(color) ? color : [color];
            data.color = { $in: colorArray };
        }
        if (size) data.size = size;
        if (category) data.category = category;
        if (brand) data.brand = brand;
        if (price) {
            const [minPrice, maxPrice] = price.split(',').map(Number); 
            data.price = { $gte: minPrice, $lte: maxPrice }; 
        } else {
            data.price = { $gte: 1000, $lte: 2000 };
        }
        const products = await Product.find(data).populate({
            path: 'rating',
            populate: {
                path: 'user',
                select: 'name email'
            }
        });
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: products
        });
    } catch (error) {
        console.error("Error on getting products:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
module.exports = {
    createProduct,
    getProductById,
    ProductFiltering
};



