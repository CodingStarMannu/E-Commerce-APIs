const mongoose = require('mongoose');




const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the Product model
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            total_price: {
                type: Number,
                required: true
            }
        }
    ],
    total_price: {
        type: Number,
        required: true
    },
    // Add other fields like shipping details, order status, etc. as needed
    status: {
        type: String,
        require: true,
        default : 'pending'
    },
    shippingAddress1: {
        type: String
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    orderDate: {
        type: Date,
        default: Date.now           
    },
    // Add timestamps
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;