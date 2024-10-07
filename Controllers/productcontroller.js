const cloudinary = require('../utils/cloudinary.js');
const Product = require('../Models/product-model.js');
const createProduct = async (req, res) => {
    try {
        if (req.user.role !== "seller") {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to perform this action"
            })
        }
        const { title, description, price, brand, category, color, size } = req.body;
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
        const mainImagePath = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            });
            stream.end(mainImage[0].buffer);
        });
        const images = [];
        if (additionalImages && additionalImages.length > 0) {
            for (const image of additionalImages) {
                const additionalImagePath = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(image.buffer);
                });
                images.push(additionalImagePath);
            }
        }
        const product = await Product.create({
            title,
            description,
            price,
            brand,
            category,
            color,
            size,
            path: mainImagePath,
            images,
        });
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
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'rating',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        return res.status(201).json({
            success: true,
            message: "Product fetched successfully",
            product: product
        })
    } catch (error) {
        console.error("Error  on getting product:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ price: 1 })
            .populate({
                path: 'rating',
                populate: {
                    path: 'user',
                    select: 'name email address'
                }
            });
        if (!products)
            return res.status(404).json({
                success: false, message: "No products found"
            });
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: products
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
        if (color) 
            data.color = color;
        if (size) data.size = size;
        if (category) data.category = category;
        if (brand) data.brand = brand;
        if (price) 
            data.price = { $gte: 1000, $lte: 1300 };
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
const editProduct = async (req, res) => {
    try {
        console.log("Starting product edit...");

        // Fetch the product by its ID
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            console.log("Product not found.");
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Only a seller can edit the product
        if (req.user.role !== "seller") {
            console.log("Unauthorized user.");
            return res.status(401).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }

        // Destructure the fields and get new images
        const { title, description, price, brand, category, color, size } = req.body;
        const mainImage = req.files?.mainImage; // New main image
        const additionalImages = req.files?.additionalImages; // New additional images

        // Process the main image if provided
        let mainImagePath = product.path; // Keep the old main image if no new one is provided
        if (mainImage) {
            try {
                console.log("Uploading new main image...");
                mainImagePath = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(mainImage[0].buffer);
                });
                console.log("Main image uploaded:", mainImagePath);
            } catch (error) {
                console.error("Failed to upload main image:", error);
                return res.status(500).json({ success: false, message: "Failed to upload main image." });
            }
        }

        // Clear the current images and add new ones
        product.images = []; // Reset the images array to empty

        if (additionalImages && additionalImages.length > 0) {
            for (const image of additionalImages) {
                try {
                    console.log("Uploading additional image...");
                    const additionalImagePath = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        });
                        stream.end(image.buffer);
                    });
                    console.log("Additional image uploaded:", additionalImagePath);
                    product.images.push(additionalImagePath); // Add the new image to the product.images array
                } catch (error) {
                    console.error("Failed to upload additional images:", error);
                    return res.status(500).json({ success: false, message: "Failed to upload additional images." });
                }
            }
        }

        // Update the other product fields
        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.color = color || product.color;
        product.size = size || product.size;
        product.path = mainImagePath; // Update the main image path

        // Save the updated product in the database
        await product.save();
        console.log("Product updated successfully.");

        // Respond with the updated product
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                brand: product.brand,
                category: product.category,
                color: product.color,
                size: product.size,
                path: product.path,
                images: product.images
            }
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    ProductFiltering,
    editProduct
};



