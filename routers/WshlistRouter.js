// api/v1/Wishlist

const express = require('express');

const {ProtectedRoters} = require('../controllers/authControllers');
const router = express.Router();

router.use(ProtectedRoters);

const {
    SendProductToWishlist,
    RemoveProductFromWishlist,
    GetAllProductsForUser
} = require('../controllers/wishlistControllers');

router
    .route('/:productId')
    .post(SendProductToWishlist)
    .delete(RemoveProductFromWishlist)

router.get('/', GetAllProductsForUser)

module.exports = router;