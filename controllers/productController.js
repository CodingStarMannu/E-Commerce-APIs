const Product = require("../models/product");
const path = require("path");

const addProduct = async (req, res) => {
  try {
    const { productName, description, category_id, discount, color } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Checking  for uniqueness based on productName and category
    const existingProduct = await Product.findOne({
      productName,
      category_id,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with the same configuration already exists.",
      });
    }

    const productImagePath1 = path.join(
      "images",
      req.files["image1"][0].filename
    );
    const productImagePath2 = path.join(
      "images",
      req.files["image2"][0].filename
    );
    const productImagePath3 = path.join(
      "images",
      req.files["image3"][0].filename
    );

    // Construct complete image paths with the new base URL
    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    const completeProductImagePath1 = `${baseUrl}${productImagePath1.replace(
      /\\/g,
      "/"
    )}`;
    const completeProductImagePath2 = `${baseUrl}${productImagePath2.replace(
      /\\/g,
      "/"
    )}`;
    const completeProductImagePath3 = `${baseUrl}${productImagePath3.replace(
      /\\/g,
      "/"
    )}`;

    const newProduct = await Product.create({
      productName,
      description,
      category_id,
      discount,
      color,
      image1: completeProductImagePath1,
      image2: completeProductImagePath2,
      image3: completeProductImagePath3,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.log("Error in adding product", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "All Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.log("Error in getting products", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.log("Error in getting product by ID", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category_id;
    console.log(category);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const products = await Product.find({ category_id: category });

    res.status(200).json({
      success: true,
      message: `Products in category '${category}' retrieved successfully`,
      data: products,
    });
  } catch (error) {
    console.log("Error in getting products by category", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, category_id, discount, color } = req.body;

    // Find the product to update
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update the fields if provided
    if (productName) {
      existingProduct.productName = productName;
    }
    if (description) {
      existingProduct.description = description;
    }
    if (category_id) {
      existingProduct.category_id = category_id;
    }
    if (discount) {
      existingProduct.discount = discount;
    }
    if (color) {
      existingProduct.color = color;
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();
    //   const baseUrl = "http://localhost:3001/";
      const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    // Construct complete image paths with the new base URL if images are provided in the request
    let imagePathsToUpdate = [];
    if (req.files && Object.keys(req.files).length > 0) {
      for (let i = 1; i <= 3; i++) {
        if (req.files[`image${i}`]) {
          const productImagePath = path.join(
            "images",
            req.files[`image${i}`][0].filename
          );
          const completeProductImagePath = `${baseUrl}${productImagePath.replace(
            /\\/g,
            "/"
          )}`;
          imagePathsToUpdate.push({ [`image${i}`]: completeProductImagePath });
        }
      }
    }

    // Update the image paths if provided
    if (imagePathsToUpdate.length > 0) {
      Object.assign(updatedProduct, ...imagePathsToUpdate);
    }

    // Save the product with updated image paths
    const savedProduct = await updatedProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.log("Error in updating product", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.log("Error in deleting product", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
};
