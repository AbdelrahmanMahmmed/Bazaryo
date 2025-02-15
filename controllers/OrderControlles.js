const { json } = require('express');
const Product = require('../models/ProductModel');
const User = require('../models/Usermodels');
const Order = require('../models/OrderModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler')

// @desc   Create Order
// @router POST   api/v1/Order
// @access   Private

exports.CreateOrder = asyncHandler(async (req, res, next) => {
    try {
        const { user, products,seller ,  paymentMethod, status } = req.body;
        let totalPrice = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(new ApiError(`Product with ID ${item.product} not found`, 404));
            }
            totalPrice += product.price * item.quantity;
        }
        const order = new Order({
            user,
            products,
            seller,
            totalPrice,
            paymentMethod : paymentMethod || 'COD',
            status: status || 'pending'
        });
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc   Get Total Order
// @router POST   api/v1/Order/total
// @access   Private
exports.TotalOrder = asyncHandler (async (req ,res ,next) =>{
    try {
        const orders = await Order.find({});
        res.json({ Total: orders.length });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

// @desc   UpdateStatusToPaid
// @router POST   api/v1/Order/:orderId/Paid
// @access   Private
exports.UpdateStatusToPaid = asyncHandler(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: 'Paid' }, 
            { new: true }
        );
        if (!order) {
            return next(new ApiError(`Order with ID ${orderId} not found`, 404));
        }
        res.json({ message: 'Order status updated to Paid', order });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});


// @desc   UpdateStatusToShipped
// @router POST   api/v1/Order/:orderId/Shipped
// @access   Private
exports.UpdateStatusToShipped = asyncHandler(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: 'Shipped' }, 
            { new: true }
        );
        if (!order) {
            return next(new ApiError(`Order with ID ${orderId} not found`, 404));
        }
        res.json({ message: 'Order status updated to Paid', order });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});


// @desc   UpdateStatusToDelivered
// @router POST   api/v1/Order/:orderId/Delivered
// @access   Private
exports.UpdateStatusToDelivered = asyncHandler(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: 'Delivered' }, 
            { new: true }
        );
        if (!order) {
            return next(new ApiError(`Order with ID ${orderId} not found`, 404));
        }
        res.json({ message: 'Order status updated to Paid', order });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});


// @desc   UpdateStatusToCancelled
// @router DELETE   api/v1/Order/:orderId/Cancelled
// @access   Private
exports.UpdateStatusToCancelled = asyncHandler(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: 'Cancelled' }, 
            { new: true }
        );
        if (!order) {
            return next(new ApiError(`Order with ID ${orderId} not found`, 404));
        }
        res.json({ message: 'Order status updated to Paid', order });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

// @desc   UpdateStatusToCancelled
// @router GET   api/v1/Order/:orderId/Cancelled
// @access   Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate('user', 'name')
            .populate('products.product', 'name price');
        if (!order) {
            return next(new ApiError(`Order with ID ${orderId} not found`, 404));
        }
        res.status(200).json({
            message: "Order retrieved successfully",
            order
        });
    } catch (error) {
        next(error);
    }
});

// @desc   getOrdersforUserId
// @router GET   api/v1/Order/:userId
// @access   Private
exports.getOrdersforUserId = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId });
        res.json(orders);
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});


// @desc   getCountAllOrdersforProduct
// @router GET   api/v1/Order/:userId
// @access   Private
exports.getCountAllOrdersforProduct = asyncHandler(async (req, res, next)=>{
    try {
        const { productId } = req.params;
        const count = await Order.countDocuments({ 'products.product': productId });
        res.json({ count });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

// @desc   getStatusforallOrders
// @router GET   api/v1/Order/status/:status
// @access   Private
exports.getStatusforallOrders = asyncHandler(async (req , res, next)=>{
    try {
        const {status} = req.params;
        let query = {};
        if (status) {
            query.status = status;
        }
        const orders = await Order.find(query);
        res.json(orders.length);
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

// @desc   getStatusforallOrders
// @router GET   api/v1/Order/user/:userId/status/:status
// @access   Private
exports.getStatusforallUser = asyncHandler(async (req, res, next) => {
    try {
        const { userId, status } = req.params;
        let query = { user: userId };
        if (status) {
            query.status = status;
        }
        const orders = await Order.find(query);
        res.status(200).json({
            message: `Total orders count for status "${status}"`,
            count: orders.length
        });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});


// @desc   Delete Order
// @router DELETE   api/v1/Order/:orderId
// @access   Private
exports.deleteOrder = asyncHandler (async (req , res , next)=>{
    try {
        const { orderId } = req.params;
        await Order.findByIdAndDelete(orderId);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});