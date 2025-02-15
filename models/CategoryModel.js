const mongoose = require('mongoose');
const CategoryModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Name must be a min {3}"],
        maxLength: [50, "Name must be a max {50}"]
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: [20, "description must be a min {20}"],
        maxLength: [500, "description must be a max {500}"]
    },
    image: {
        type: String
    },
}, { timestamps: true });

const Category = mongoose.model('Category', CategoryModel);

module.exports = Category