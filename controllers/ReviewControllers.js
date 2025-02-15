const express = require('express');
const review = require('../models/ReviewModel');
const asyncHandler = require('express-async-handler');

exports.addReview = asyncHandler(async (req, res) => {
    const { user, rating, reviewText } = req.body;
    const { productId } = req.params;
    try {
        const productReview = await review.findOne({ 'ratings.product': productId });
        if (!productReview) {
            const newReview = new review({
                ratings: [{
                    user : user._id,
                    product: productId,
                    rating,
                    review: reviewText
                }]
            });

            await newReview.save();
            return res.status(201).json({ message: "Review added successfully", review: newReview });
        }
        productReview.ratings.push({
            user,
            product: productId,
            rating,
            review: reviewText
        });
        await productReview.save();
        res.status(201).json({ message: "Review added successfully", review: productReview });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


exports.getReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await review.find({ 'ratings.product': productId })
            .populate('ratings.user', 'name email')
            .populate('ratings.product', 'name price');

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

exports.updateReview = asyncHandler(async (req, res) => {
    const { rating, reviewText } = req.body;
    const { reviewId } = req.params;

    try {
        const reviewToUpdate = await review.findOne({ 'ratings._id': reviewId });

        if (!reviewToUpdate) {
            return res.status(404).json({ message: "Review not found" });
        }

        const reviewIndex = reviewToUpdate.ratings.findIndex(r => r._id.toString() === reviewId);
        
        if (reviewIndex !== -1) {
            reviewToUpdate.ratings[reviewIndex].rating = rating;
            reviewToUpdate.ratings[reviewIndex].review = reviewText;
            await reviewToUpdate.save();
        }

        res.status(200).json({ message: "Review updated successfully", review: reviewToUpdate });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


exports.deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    try {
        const reviewToDelete = await review.findOne({ 'ratings._id': reviewId });

        if (!reviewToDelete) {
            return res.status(404).json({ message: "Review not found" });
        }

        reviewToDelete.ratings = reviewToDelete.ratings.filter(r => r._id.toString() !== reviewId);
        await reviewToDelete.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
