const Variant = require('../models/variant');
const Product = require('../models/product');


const addVariant = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const images = req.files;

        // // Checking if the required fields are provided
        // if (!productName || !size || !images || images.length === 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Incomplete data provided for variant.'
        //     });
        // }

        // Checking  if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        // Processing images and saving to storage
        const imagePaths = images.map((image, index) => {
            const imagePath = `/images/${image.filename}`;
            return imagePath;
        });

        // Create new variant
        const newVariant = new Variant({
            productId,
            size,
            colorHex: req.body.colorHex,
            colorName: req.body.colorName,
            frontImage: imagePaths[0],
            midImage: imagePaths[1],
            lastImage: imagePaths[2],
        });

        const savedVariant = await newVariant.save();

        res.status(201).json({
            success: true,
            message: 'Variant added successfully',
            data: savedVariant
        });
    } catch (error) {
        console.log('Error in adding variant', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getVariants = async (req, res) => {
    try {
        const variants = await Variant.find();
        res.status(200).json({
            success: true,
            message: 'All Variants retrieved successfully',
            data: variants
        });
    } catch (error) {
        console.log('Error in getting variants', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getVariantById = async (req, res) => {
    try {
        const variantId = req.params.id;
        const variant = await Variant.findById(variantId);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Variant retrieved successfully',
            data: variant
        });
    } catch (error) {
        console.log('Error in getting variant by ID', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const updateVariant = async (req, res) => {
    try {
        const variantId = req.params.id;
        const { size, colorHex, colorName } = req.body;
        const images = req.files;

        // Checking if the variant exists
        const existingVariant = await Variant.findById(variantId);

        if (!existingVariant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        // Updating the variant fields
        existingVariant.size = size || existingVariant.size;
        existingVariant.colorHex = colorHex || existingVariant.colorHex;
        existingVariant.colorName = colorName || existingVariant.colorName;

        // Processing and updating images if provided
        if (images && images.length > 0) {
            const updatedImagePaths = images.map((image, index) => {
                const imagePath = `/images/${image.filename}`;
                return imagePath;
            });

            existingVariant.frontImage = updatedImagePaths[0] || existingVariant.frontImage;
            existingVariant.midImage = updatedImagePaths[1] || existingVariant.midImage;
            existingVariant.lastImage = updatedImagePaths[2] || existingVariant.lastImage;
        }

        // Saving the updated variant
        const updatedVariant = await existingVariant.save();

        res.status(200).json({
            success: true,
            message: 'Variant updated successfully',
            data: updatedVariant
        });
    } catch (error) {
        console.log('Error in updating variant', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const deleteVariant = async (req, res) => {
    try {
        const variantId = req.params.id;

        // Deleting the variant
        const deletedVariant = await Variant.findByIdAndDelete(variantId);

        if (!deletedVariant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Variant deleted successfully',
            data: deletedVariant
        });
    } catch (error) {
        console.log('Error in deleting variant', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    addVariant,
    getVariants,
    getVariantById,
    updateVariant,
    deleteVariant
};
