
const Product = require('../Models/product-model');
// const Cart = require('../Models/cart-model');
// const Product = require('../Models/product-model');
const Cart = require('../Models/cart-model');

const AddtoCart = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            user: req.user.id
        });
        if (!cartItem) {
            const newCart = new Cart({
                user: req.user.id,
                items: [{ productId: req.params.id, quantity: 1 }] // Initialize quantity to 1
            });
            await newCart.save();
            return res.status(201).json({
                message: 'Product added to cart',
                cart: newCart
            });
        } 
        const existingProduct = cartItem.items.find(item => item.productId.toString() === req.params.id);
        if (existingProduct) {
            // If product exists, increase its quantity
            existingProduct.quantity += 1;
            await cartItem.save();
            return res.status(200).json({
                message: 'Product quantity increased in cart',
                cart: cartItem
            });
        } else {
            cartItem.items.push({
                productId: req.params.id,
                quantity: 1 
            });
            await cartItem.save();
            return res.status(200).json({
                message: 'Product added to cart',
                cart: cartItem
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    AddtoCart
};

