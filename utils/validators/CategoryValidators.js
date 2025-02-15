
const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');


exports.getCategoryValiadtors = [
    param('id').isMongoId().withMessage('Invalid Category id'),
    validatorsMiddleware,
];

exports.createCategoryValidators = [
    body('name')
        .notEmpty()
        .withMessage("name Required")
        .isLength({ min: 3 })
        .withMessage("Too short Category name")
        .isLength({ max: 50 })
        .withMessage("Too long Category name"),

    body('description')
        .notEmpty()
        .withMessage("description Required")
        .isLength({ min: 10 })
        .withMessage("Too short Category description")
        .isLength({ max: 500 })
        .withMessage("Too long Category description"),
    validatorsMiddleware,
];

exports.updateCategoryValiadtors = [
    param('id').isMongoId().withMessage('Invalid Category id'),
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short Category name")
        .isLength({ max: 50 })
        .withMessage("Too long Category name"),

    body('description')
        .optional()
        .isLength({ min: 10 })
        .withMessage("Too short Category description")
        .isLength({ max: 500 })
        .withMessage("Too long Category description"),
    validatorsMiddleware,
];

exports.UpdateImageValidators = [
    param('id')
        .isMongoId()
        .withMessage('Invalid Category id'),
    body('image')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            return true;
        }),
    validatorsMiddleware,
];
exports.deleteCategoryValiadtors = [
    param('id').isMongoId().withMessage('Invalid Category id'),
    validatorsMiddleware,
];