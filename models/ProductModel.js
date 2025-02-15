const mongoose = require('mongoose');

const productModel = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: [3, "Name must be a min {3}"],
        maxLength: [50, "Name must be a max {50}"]
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minLength: [10, "description must be a min {10}"],
        maxLength: [500, "description must be a max {500}"]
    },
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be a at least {1}"],
        max: [10000, "Price must be a most {10000}"]
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "quantity must be a at least {1}"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    imageProduct: {
        type: String,
        default: 'default.jpg'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });


const Product = mongoose.model('Product', productModel);
module.exports = Product;