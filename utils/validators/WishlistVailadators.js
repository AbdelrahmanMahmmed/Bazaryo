
const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');
const Product = require('../../models/ProductModel');
const Category = require('../../models/ProductModel');
const User = require('../../models/Usermodels.js');
const mongoose = require('mongoose');



// exports.getProductValiadtors = [
//     param('id').isMongoId().withMessage('Invalid Product id'),
//     validatorsMiddleware,
// ];

// exports.SendProductToWishlistValidators = [
//     body("productId")
//         .custom(async (value, { req }) => {
//             const user = await User.findById(req.user._id);
//             if (!user) {
//                 throw new ApiError(`User not found for ${req.user._id}`, 404);
//             }
//             if (user.Wishlists.includes(value)) {
//                 throw new ApiError("Product already exists in wishlist.", 400);
//             }

//             return true;
//         }),

//     validatorsMiddleware,
// ];

// exports.updateProductValiadtors = [
//     param('id').isMongoId().withMessage('Invalid Product id'),

//     validatorsMiddleware,
// ];

// exports.UpdateImageValiadtors = [
//     param('id')
//         .isMongoId()
//         .withMessage('Invalid Product id'),
//     validatorsMiddleware,
// ];


// exports.deleteProductValiadtors = [
//     param('id').isMongoId().withMessage('Invalid Product id'),
//     validatorsMiddleware,
// ];