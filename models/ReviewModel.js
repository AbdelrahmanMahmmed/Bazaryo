
const mongoose = require('mongoose')
const reviewModel = new mongoose.Schema({
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
        }
    }]
}, { timestamps: true });


const review = mongoose.model('review', reviewModel);
module.exports = review;