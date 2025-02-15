const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');
const User = require('../../models/Usermodels')
const bcrypt = require('bcryptjs');

exports.getUserValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.createUserValidators = [
    body("name")
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email) => {
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new Error('Email already exists');
            }
        }),

    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom(async (password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    body("confirmPassword")
        .notEmpty()
        .withMessage('Confirm Password is required'),

    body("role")
        .optional(),

    body("profileImage")
        .optional(),

    body("phoneNumber")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage('Invalid phone number'),

    validatorsMiddleware,
];

exports.updateUserValidators = [
    param('id').isMongoId().withMessage('Invalid User ID'),

    body("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body("email")
        .optional()
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email, { req }) => {
            const userExists = await User.findOne({ email });
            if (userExists && userExists._id.toString() !== req.params.id) {
                throw new Error('Email already exists');
            }
        }),

    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom(async (password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    body("confirmPassword")
        .optional(),

    body("role")
        .optional()
        .isIn(["buyer", "seller", "admin"])
        .withMessage('Invalid role'),

    body("phoneNumber")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage('Invalid phone number'),

    body("storeName")
        .optional()
        .isLength({ min: 5 })
        .withMessage('storeName must be at least 5 characters long')
        .isLength({ max: 25 })
        .withMessage('storeName must be at most 25 characters long'),

    body("storeDescription")
        .optional()
        .isLength({ min: 5 })
        .withMessage('storeDescription must be at least 5 characters long')
        .isLength({ max: 500 })
        .withMessage('storeDescription must be at most 500 characters long'),

    body('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array'),

    validatorsMiddleware,
];

exports.ChanagesPasswordUserValiadtors = [
    param('id')
        .isMongoId()
        .withMessage('Invalid User id'),

    body("currentPassword")
        .notEmpty()
        .withMessage('Current Password is required'),

    body("PasswordConfirm")
        .notEmpty()
        .withMessage('New Password is required')
        .isLength({ min: 6 })
        .withMessage('New Password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    body("password")
        .notEmpty()
        .withMessage('Confirm Password is required')
        .custom(async (password, { req }) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('User not found');
            }
            const isCorrectPassword = bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            return true;
        }),

    validatorsMiddleware,
];

exports.deleteUserValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];