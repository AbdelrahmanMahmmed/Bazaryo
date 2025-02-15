// api/v1/Product

const express = require('express');
const {
    getProductValiadtors,
    updateProductValiadtors,
    deleteProductValiadtors,
    createProductValidators,
    UpdateImageValiadtors
} = require('../utils/validators/ProductsVailators');

const CategoryRouter = require('../routers/CategoryRouter.js');


const { upload } = require('../utils/UploadImage');
const { allwedTo, ProtectedRoters } = require('../controllers/authControllers');

const router = express.Router();

router.use('/:CategroyId/Products' , CategoryRouter);

router.use(ProtectedRoters);

const {
    createProduct,
    getProduct,
    getProducts,
    UpdateProduct,
    DeleteProduct,
    DeleteProduct_FromAdmin,
    Update_Image_For_Any_Product
} = require('../controllers/productControllers.js');


router.put('/update-Image-Product/:id',
    allwedTo('seller'),
    upload.single('imageProduct'),
    UpdateImageValiadtors,
    Update_Image_For_Any_Product
);

router.delete('/admin/:id', allwedTo('admin'), DeleteProduct_FromAdmin)

router
    .route('/')
    .get(getProducts)
    .post(upload.single('imageProduct'), createProductValidators, createProduct);

router
    .route('/:id')
    .get(getProductValiadtors, getProduct)
    .put(updateProductValiadtors, UpdateProduct)
    .delete(deleteProductValiadtors, DeleteProduct);

module.exports = router;