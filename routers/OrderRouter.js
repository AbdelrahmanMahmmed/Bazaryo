// api/v1/Order

const express = require('express');
const {
    createOrderValidators,
    deleteOrderValiadtors
} = require('../utils/validators/OrderValidators');

const { allwedTo, ProtectedRoters } = require('../controllers/authControllers');

const router = express.Router();

router.use(ProtectedRoters);

const {
    CreateOrder,
    getOrder,
    TotalOrder,
    UpdateStatusToPaid,
    UpdateStatusToShipped,
    UpdateStatusToDelivered,
    UpdateStatusToCancelled,
    getOrdersforUserId,
    getCountAllOrdersforProduct,
    getStatusforallOrders,
    getStatusforallUser,
    deleteOrder
} = require('../controllers/OrderControlles');


router.get('/total' , allwedTo('admin') , TotalOrder);

router.put('/:orderId/Paid' , allwedTo('seller') , UpdateStatusToPaid);
router.put('/:orderId/Shipped' , allwedTo('seller') , UpdateStatusToShipped);
router.put('/:orderId/Delivered' , allwedTo('seller') , UpdateStatusToDelivered);
router.delete('/:orderId/Cancelled' , allwedTo('buyer') , UpdateStatusToCancelled);

router.get('/:userId' , allwedTo('buyer') ,  getOrdersforUserId);

router.get('/Product/:productId/count', getCountAllOrdersforProduct)

router.get('/status/:status', getStatusforallOrders)

router.get('/user/:userId/status/:status', getStatusforallUser)

router
    .route('/')
    .post(allwedTo('buyer'),createOrderValidators , CreateOrder);

router
    .route('/:orderId')
    .get(getOrder)
    .delete(deleteOrderValiadtors, deleteOrder);

module.exports = router;