const Rating = require('../Models/rating-model.js')
const Product = require('../Models/product-model.js')
const AddReview = async (req, res) => {
    try {
        const author = req.user.id
        const { stars, description } = req.body
        const product = await Product.findOne({ _id: req.params.id })
        const review = new Rating({
            stars,
            description,
            user: author,
            product: req.params.id
        })
        await review.save()
        product.rating.push(review._id)
        product.save()
        console.log(review);
        res.status(200).json({ 
            message: 'Review Added Successfully',
    
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
}
module.exports = {
    AddReview
}