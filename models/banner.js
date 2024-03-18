const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        image1: {
            type: String,
            default: null,
        },
        image2: {
            type: String,
            default: null,
        },
        image3: {
            type: String,
            default: null,
        },
        banner_id: {
            type: Number,
            default: null,
        },
    }
)

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;