const User = require('../models/Usermodels');
const Product = require('../models/ProductModel');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')

// @desc   SendProductToCart
// @router POST   api/v1/Cart/:ProductId
// @access   Public

exports.SendProductToCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError(`Product not found for ${productId}`, 404));
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }

    if (user.Cart.includes(productId)) {
        return next(new ApiError("Product already exists in Cart.", 400));
    }
    user.Cart.push(productId);
    await user.save();
    res.status(200).json({
        message: "Product added to Cart successfully...",
        product
    });
});

// @desc   RemoveProduct from Cart
// @router DELETE   api/v1/Cart/:ProductId
// @access   Public

exports.RemoveProductFromCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { Cart: productId } },
        { new: true }
    );
    if (!updatedUser.Cart.includes(productId)) {
        return res.status(200).json({
            message: "Product removed from Cart successfully."
        });
    } else {
        return next(new ApiError("Product not found in Cart.", 404));
    }
});


// @desc   Get All Product from Cart
// @router GET   api/v1/Cart/:ProductId
// @access   Public
exports.GetAllProductsForUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(`User not found for ${req.user._id}`, 404));
    }
    const products = await Product.find({ _id: { $in: user.Cart } });
    res.status(200).json({ products });
})


// @desc   Clear All Product from Cart
// @router GET   api/v1/Cart/clear
// @access   Public
exports.ClearProductsFromCart = asyncHandler (async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { Cart: [] },
        { new: true }
    );
    res.status(200).json({
        message: "All products removed from Cart successfully."
    });
});