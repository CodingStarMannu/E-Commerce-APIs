const Product = require('../models/product');

const addProduct = async (req, res) => {
    try {
        const { productName, description, category_id, discount, color } = req.body;
        const images = req.files;

        // Ensuring images were provided in the request
        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided for the product.'
            });
        }

        // Checking  for uniqueness based on productName and category
        const existingProduct = await Product.findOne({
            productName,
            category_id
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product with the same configuration already exists.'
            });
        }


        // Processing images 
        const imagePaths = images.map((image, index) => {
            const imagePath = `/images/${image.filename}`; 
            return imagePath;
        });

        const newProduct = new Product({
            productName,
            description,
            category_id,
            discount,
            color,
            image1: imagePaths[0],
            image2: imagePaths[1],
            image3: imagePaths[2],
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: savedProduct
        });
    } catch (error) {
        console.log('Error in adding product', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json
        (
            { 
            success: true,  
            message: 'All Products retrieved successfully', 
            data: products
            }
        );
    } catch (error) {
        console.log('Error in getting products', error);
        res.status(500).json
        (
            {
            success: false, 
            message: 'Internal Server Error' 
            }
        );
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json
            (
                { 
                success: false, 
                message: 'Product not found' 
                }
            );
        }

        res.status(200).json
        (
            { 
            success: true, 
            message: 'Product retrieved successfully', 
            data: product
            }
        );
    } catch (error) {
        console.log('Error in getting product by ID', error);
        res.status(500).json
        (
            { 
            success: false, 
            message: 'Internal Server Error' 
            }
        );
    }
};


const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category_id;
        console.log(category);

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category is required.'
            });
        }

        const products = await Product.find({ category_id: category});


        res.status(200).json({
            success: true,
            message: `Products in category '${category}' retrieved successfully`,
            data: products
        });
    } catch (error) {
        console.log('Error in getting products by category', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


const updateProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        const { productName, description, category_id, discount, color } = req.body;
        const images = req.files;

        // Checking for uniqueness based on productName and category, excluding the current product
        const duplicateProduct = await Product.findOne({
            _id: { $ne: productId }, //$ne mongoDB query is a comparison operator that stands for "not equal." 
            productName,
            category_id
        }); 

        if (duplicateProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product with the same configuration already exists.'
            });
        }

        // Updating the product fields
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Updating only the specified fields
        existingProduct.productName = productName || existingProduct.productName;
        existingProduct.description = description || existingProduct.description;
        existingProduct.category_id = category_id || existingProduct.category_id;
        existingProduct.discount = discount || existingProduct.discount;
        existingProduct.color = color || existingProduct.color;

        // Processing and updating images
        if (images && images.length > 0) {
            const updatedImagePaths = images.map((image, index) => {
                const imagePath = `/images/${image.filename}`;
                return imagePath;
            });

            existingProduct.image1 = updatedImagePaths[0] || existingProduct.image1;
            existingProduct.image2 = updatedImagePaths[1] || existingProduct.image2;
            existingProduct.image3 = updatedImagePaths[2] || existingProduct.image3;
        }

        // Saving the updated product
        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        console.log('Error in deleting product', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


module.exports = { addProduct, getProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct};
