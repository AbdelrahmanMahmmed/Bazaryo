const { json } = require('express');
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler')
const { uploadImage } = require('../utils/UploadImage')

// @desc   Find All Categorys
// @router Get   api/v1/Category
// @access   Public

exports.getCategorys = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.params.CategroyId) {
        filter = { Category: req.params.CategroyId }
    }
    const category = await Category.find(filter)
    res.status(200).json({ results: category.length, data: category });
});

// @desc   Get Category By Id
// @router Get   api/v1/Category/:id
// @access   Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) { return next(new ApiError(`No Category for this id :  ${id}`, 404)) };
    res.status(200).json({ data: category });
});


// @desc   Update   Category By Id
// @router PUT      api/v1/Category/:id
// @access          Private
exports.UpdateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
        { _id: id },
        {
            name,
            description
        },
        { new: true }
    );
    if (!category) { return next(new ApiError(`No Category for this id :  ${id}`, 404)) };
    res.status(200).json({ data: category });
})


// @desc   Delete   Category By Id
// @router Delete   api/v1/Category/:id
// @access          Private
exports.DeleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) { return next(new ApiError(`No Category for this id :  ${id}`, 404)) };
    res.status(200).json({ message: "Delete Category Successflly..." });
})


// @desc     Create   Category
// @router   Post     api/v1/Category
// @access            Private
exports.createCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Name and Description are required" });
        }
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const category = new Category({
            name,
            description,
            image: imageUrl
        });

        console.log(category);

        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// @desc    Update_Image_For_Any_Category
// @router POST   api/v1/Category/update-image
// @access   Private/protect
exports.Update_Image_For_Any_category = asyncHandler(async (req, res, next) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.image = imageUrl;
        await category.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// @desc    get_All_Products_On_CatergoryID
// @router POST   /Category/:CategoryId/Products
// @access   Private/protect
exports.get_All_Products_On_CatergoryID = asyncHandler(async (req, res) => {
    try {
        const { CategoryId } = req.params;
        const products = await Product.find({ category: CategoryId });

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});