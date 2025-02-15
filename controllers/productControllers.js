const { json } = require('express');
const Product = require('../models/ProductModel');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')
const { uploadImage } = require('../utils/UploadImage')

/////////////////////  Admin   /////////////////////

exports.DeleteProduct_FromAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) { return next(new ApiError(`No Order for this id :  ${id}`, 404)) };
    res.status(200).json({ message: "Delete Product from Admin Successflly..." });
})

/////////////////////  Seller   /////////////////////

// @desc   Find All Products
// @router Get   api/v1/Product
// @access   Public

exports.getProducts = asyncHandler(async (req, res) => {
    const product = await Product.find({})
        .populate({
            path: 'seller',
            select: 'name phoneNumber storeName -_id'
        }).populate({
            path: 'category',
            select: 'name -_id'
        });;
    res.status(200).json({ results: product.length, data: product });
});

// @desc   Get Product By Id
// @router Get   api/v1/Product/:id
// @access   Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate({
            path: 'seller',
            select: 'name phoneNumber storeName -_id'
        }).populate({
            path: 'category',
            select: 'name -_id'
        });;
    if (!product) { return next(new ApiError(`No Order for this id :  ${id}`, 404)) };
    res.status(200).json({ data: product });
})


// @desc   Update   Product By Id
// @router PUT      api/v1/Product/:id
// @access          Private
exports.UpdateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, quantity, category, imageProduct, seller } = req.body;
    const product = await Product.findByIdAndUpdate(
        { _id: id },
        {
            name,
            description,
            price,
            quantity,
            category,
            imageProduct,
            seller
        },
        { new: true }
    ).populate({
        path: 'seller',
        select: 'name phoneNumber storeName -_id'
    }).populate({
        path: 'category',
        select: 'name -_id'
    });
    if (!product) { return next(new ApiError(`No Order for this id :  ${id}`, 404)) };
    res.status(200).json({ data: product });
})


// @desc   Delete   Product By Id
// @router Delete   api/v1/Product/:id
// @access          Private
exports.DeleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) { return next(new ApiError(`No Order for this id :  ${id}`, 404)) };
    res.status(200).json({ message: "Delete Product Successflly..." });
})


// @desc     Create   Product
// @router   Post     api/v1/Product
// @access            Private
exports.createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, quantity, category, seller } = req.body;
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            quantity,
            category,
            seller,
            imageProduct: imageUrl
        });
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// @desc    Update_Image_For_Any_Product
// @router POST   api/v1/Product/update-image
// @access   Private/protect
exports.Update_Image_For_Any_Product = asyncHandler(async (req, res, next) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.imageProduct = imageUrl;
        await product.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});