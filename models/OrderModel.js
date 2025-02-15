const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    seller : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: "COD",
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    }
} , {timestamps : true,});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;