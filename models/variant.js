const mongoose = require('mongoose');
const Product = require('./product');

const variantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
        index: true,
    },
    size:{
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'],
        required: true
    },
    colorHex: {
        type: String,
    },
    colorName: {
        type: String,
    },
    frontImage: {
        type: String,
    },
    midImage: {
        type: String,
    },
    lastImage: {
        type: String,
    },
});

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;
