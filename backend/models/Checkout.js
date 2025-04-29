const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
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
        quantity: {
            type: Number,
            required: true,
        },
        size: String,
        color: String,
    },
    { _id: false }
);

const checkoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        checkoutItems: {
            type: [checkoutItemSchema],
            default: [], // Ensures an empty array instead of undefined
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
            default: null, // Ensures consistency when payment isn't made yet
        },
        paymentStatus: {
            type: String,
            default: "pending",
        },
        paymentDetails: {
            type: mongoose.Schema.Types.Mixed, // Stores payment-related details (transaction ID, PayPal response, etc.)
            default: {}, // Prevents null issues
        },
        isFinalized: {
            type: Boolean,
            default: false,
        },
        finalizedAt: {
            type: Date,
            default: null, // Prevents undefined issues
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
