// api/v1/Cart

const express = require('express');

const {ProtectedRoters} = require('../controllers/authControllers');
const router = express.Router();

router.use(ProtectedRoters);

const {
    SendProductToCart,
    RemoveProductFromCart,
    GetAllProductsForUser,
    ClearProductsFromCart
} = require('../controllers/CartContollers');

router
    .route('/:productId')
    .post(SendProductToCart)
    .delete(RemoveProductFromCart)

router.get('/', GetAllProductsForUser)

router.put('/clear' , ClearProductsFromCart)
module.exports = router;