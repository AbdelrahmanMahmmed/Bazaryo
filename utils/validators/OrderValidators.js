const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');
const Product = require('../../models/ProductModel');
const User = require('../../models/Usermodels.js');

exports.createOrderValidators = [
    body('user')
        .notEmpty().withMessage('User is required')
        .isMongoId()
        .withMessage('UserId is invalid')
        .custom(async (userId) => {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return true;
        }),

    body('products')
        .notEmpty().withMessage('Products is required')
        .isArray()
        .custom(async (products) => {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findById(products[i].product);
                if (!product) {
                    throw new Error(`Invalid Product ID: ${products[i].product}`);
                }
                if (products[i].quantity > product.quantity) {
                    throw new Error(`Not enough stock for Product ID: ${products[i].product}`);
                }
            }
            return true;
        }),
    body('seller')
        .notEmpty().withMessage('Seller is required')
        .isMongoId()
        .withMessage('Seller ID is invalid')
        .custom(async (sellerId) => {
            const seller = await User.findById(sellerId);
            if (!seller || !(seller.role === 'seller')) {
                throw new Error(`Seller with ID ${sellerId} does not exist or is not a seller`);
            }
            return true;
        }),
    body('totalPrice')
        .optional(),


    body('paymentMethod')
        .optional(),

    body('status')
        .optional()
        .isIn(['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']),
    validatorsMiddleware,
];

exports.deleteOrderValiadtors = [
    param('orderId').isMongoId().withMessage('Invalid Order id'),
    validatorsMiddleware,
];