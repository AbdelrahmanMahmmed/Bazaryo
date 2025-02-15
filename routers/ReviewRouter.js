const express = require('express');
const router = express.Router();
const { addReview, getReviews, updateReview, deleteReview } = require('../controllers/ReviewControllers');
const { allwedTo, ProtectedRoters } = require('../controllers/authControllers');

router.use(ProtectedRoters)

router.post('/:productId', allwedTo('buyer') , addReview);

router.get('/:productId', allwedTo('buyer') ,  getReviews);

router.put('/:reviewId', allwedTo('buyer') , updateReview);

router.delete('/:reviewId', allwedTo('buyer') , deleteReview);

module.exports = router;
