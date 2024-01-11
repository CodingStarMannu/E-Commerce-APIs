const mongoose = require('mongoose');
const Category = require('./category');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true,
        index: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    color: {
        type: String,
    },
    image1: {
        type: String,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
