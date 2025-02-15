const User = require('../models/Usermodels');
const Product = require('../models/ProductModel');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')

// @desc   SendProductToWishlist
// @router POST   api/v1/Wishlist/:ProductId
// @access   Public

exports.SendProductToWishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError(`Product not found for ${productId}`, 404));
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }

    if (user.Wishlists.includes(productId)) {
        return next(new ApiError("Product already exists in wishlist.", 400));
    }
    user.Wishlists.push(productId);
    await user.save();
    res.status(200).json({
        message: "Product added to wishlist successfully...",
        product
    });
});

// @desc   RemoveProduct from Wishlist
// @router DELETE   api/v1/Wishlist/:ProductId
// @access   Public

exports.RemoveProductFromWishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { Wishlists: productId } },
        { new: true }
    );
    if (!updatedUser.Wishlists.includes(productId)) {
        return res.status(200).json({
            message: "Product removed from wishlist successfully."
        });
    } else {
        return next(new ApiError("Product not found in wishlist.", 404));
    }
});


// @desc   Get All Product from Wishlist
// @router GET   api/v1/Wishlist/:ProductId
// @access   Public
exports.GetAllProductsForUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }
    const products = await Product.find({ _id: { $in: user.Wishlists } });
    res.status(200).json({ products });
})