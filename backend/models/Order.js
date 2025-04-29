const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true, // Fixed incorrect string usage
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        size: String,
        color: String,
        quantity: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Fixed incorrect string usage
        },
        orderItems: {
            type: [orderItemSchema],
            default: [], // Prevents undefined array issues
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
            default: null, // Prevents undefined issues
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
            default: null, // Prevents undefined issues
        },
        paymentStatus: {
            type: String,
            default: "pending",
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema); // Fixed model name to be capitalized
