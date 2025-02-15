
const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');
const Product = require('../../models/ProductModel');
const Category = require('../../models/ProductModel');
const User = require('../../models/Usermodels.js');


exports.getProductValiadtors = [
    param('id').isMongoId().withMessage('Invalid Product id'),
    validatorsMiddleware,
];

exports.createProductValidators = [
    body('name')
        .notEmpty().withMessage("name Required")
        .isLength({ min: 3 }).withMessage("Too short product name")
        .isLength({ max: 50 }).withMessage("Too long product name"),

    body('description')
        .notEmpty().withMessage("description Required")
        .isLength({ min: 10 }).withMessage("Too short product description")
        .isLength({ max: 500 }).withMessage("Too long product description"),

    body('price')
        .notEmpty().withMessage("Price Required")
        .isNumeric().withMessage('Total price must be a number')
        .custom((val) => {
            if (val < 1 || val > 10000) {
                throw new Error('Price must be > 1 and <= 10000');
            }
            return true;
        }),

    body('quantity')
        .notEmpty().withMessage("quantity Required")
        .isNumeric().withMessage('Total quantity must be a number')
        .custom((val) => {
            if (val < 1) {
                throw new Error('Quantity must be > 0');
            }
            return true;
        }),
    body('imageProduct')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            return true;
        }),

    body('category')
        .notEmpty().withMessage("Category Required")
        .isMongoId().withMessage('Invalid Category id'),

    body('seller')
        .notEmpty().withMessage("seller Required")
        .isMongoId().withMessage('Invalid seller id')
        .custom(async (SellerId) => {
            const SellerExists = await User.findById(SellerId);
            if (!SellerExists || !(SellerExists.role === 'seller')) {
                throw new Error(`Seller with ID ${SellerId} does not exist or is not a seller`);
            }
            return true;
        }),

    validatorsMiddleware,
];

exports.updateProductValiadtors = [
    param('id').isMongoId().withMessage('Invalid Product id'),

    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short product name")
        .isLength({ max: 50 })
        .withMessage("Too long product name"),

    body('description')
        .optional()
        .isLength({ min: 10 })
        .withMessage("Too short product description")
        .isLength({ max: 500 })
        .withMessage("Too long product description"),

    body('price')
        .optional()
        .isNumeric()
        .withMessage('Total price must be a number')
        .custom((val) => {
            if (val > 1 && val <= 10000) {
                throw new Error('Must Price > 1 && <= 10000');
            }
        }),

    body('quantity')
        .optional()
        .isNumeric()
        .withMessage('Total quantity must be a number')
        .custom((val) => {
            if (val > 1) {
                throw new Error('Must v=quantity > 1');
            }
        }),

    body('imageProduct')
        .optional(),

    body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid Category id')
        .custom(async (CategoryId) => {
            const CategoryExists = await Category.findById(CategoryId);
            if (!CategoryExists) {
                throw new Error(`Customer with ID ${CategoryId} does not exist`);
            }
            return true;
        }),

    body('seller')
        .optional()
        .isMongoId()
        .withMessage('Invalid seller id')
        .custom(async (SellerId) => {
            const SellerExists = await User.findById(SellerId);
            if (!SellerExists || !(SellerExists.role === 'seller')) {
                throw new Error(`Seller with ID ${SellerId} does not exist`);
            }
            return true;
        }),
    validatorsMiddleware,
];

exports.UpdateImageValiadtors = [
    param('id')
        .isMongoId()
        .withMessage('Invalid Product id'),
    body('imageProduct')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            return true;
        }),
    validatorsMiddleware,
];


exports.deleteProductValiadtors = [
    param('id').isMongoId().withMessage('Invalid Product id'),
    validatorsMiddleware,
];