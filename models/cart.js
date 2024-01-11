const mongoose = require('mongoose');
const User = require('./user');
const Product = require('./product');

const cartSchema = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
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
    ]
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;


