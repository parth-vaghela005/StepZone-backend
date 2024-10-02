const cloudinary = require('../utils/cloudinary.js'); // Adjust the path as needed
const Product = require('../Models/product-model.js')

const createProduct = async (req, res) => {
    try {
        const { title, description, price, brand, category,color,size } = req.body;
        const mainImage = req.files.mainImage; // The main image uploaded
        const additionalImages = req.files.additionalImages; // Additional images uploaded

        // Check if the main image is provided
        if (!mainImage) {
            return res.status(400).json({ success: false, message: "Please upload a main image." });
        }

        // Upload main image to Cloudinary
        const mainImageResponse = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
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

module.exports = {
    createProduct,
    
};





