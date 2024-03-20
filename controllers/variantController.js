const Variant = require("../models/variant");
const Product = require("../models/product");
const path = require("path");

const addVariant = async (req, res) => {
  try {
    const { productId, size, colorHex, colorName } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Checking  if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const variantImagePath1 = path.join(
      "images",
      req.files["image1"][0].filename
    );
    const variantImagePath2 = path.join(
      "images",
      req.files["image2"][0].filename
    );
    const variantImagePath3 = path.join(
      "images",
      req.files["image3"][0].filename
    );

    // Construct complete image paths with the new base URL
    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    const completeVariantImagePath1 = `${baseUrl}${variantImagePath1.replace(
      /\\/g,
      "/"
    )}`;
    const completeVariantImagePath2 = `${baseUrl}${variantImagePath2.replace(
      /\\/g,
      "/"
    )}`;
    const completeVariantImagePath3 = `${baseUrl}${variantImagePath3.replace(
      /\\/g,
      "/"
    )}`;
    // Create new variant
    const newVariant = new Variant({
      productId,
      size,
      colorHex,
      colorName,
      frontImage: completeVariantImagePath1,
      midImage: completeVariantImagePath2,
      lastImage: completeVariantImagePath3,
    });

    const savedVariant = await newVariant.save();

    res.status(201).json({
      success: true,
      message: "Variant added successfully",
      data: savedVariant,
    });
  } catch (error) {
    console.log("Error in adding variant", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getVariants = async (req, res) => {
  try {
    const variants = await Variant.find();
    res.status(200).json({
      success: true,
      message: "All Variants retrieved successfully",
      data: variants,
    });
  } catch (error) {
    console.log("Error in getting variants", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getVariantById = async (req, res) => {
  try {
    const id = req.params.id;
    const variant = await Variant.findById(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Variant retrieved successfully",
      data: variant,
    });
  } catch (error) {
    console.log("Error in getting variant by ID", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateVariant = async (req, res) => {
  try {
    const id = req.params.id;
    const { size, colorHex, colorName } = req.body;

    // Checking if the variant exists
    const existingVariant = await Variant.findById(id);
    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found.",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      // If no new images are uploaded, keep the existing image paths
      const updatedVariant = await Variant.findByIdAndUpdate(
        id,
        { size, colorHex, colorName },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: updatedVariant,
      });
    }

    // Construct complete image paths with the new base URL
    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    let completeVariantImagePath1,
      completeVariantImagePath2,
      completeVariantImagePath3;

    if (req.files["image1"]) {
      const variantImagePath1 = path.join(
        "images",
        req.files["image1"][0].filename
      );
      completeVariantImagePath1 = `${baseUrl}${variantImagePath1.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files["image2"]) {
      const variantImagePath2 = path.join(
        "images",
        req.files["image2"][0].filename
      );
      completeVariantImagePath2 = `${baseUrl}${variantImagePath2.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files["image3"]) {
      const variantImagePath3 = path.join(
        "images",
        req.files["image3"][0].filename
      );
      completeVariantImagePath3 = `${baseUrl}${variantImagePath3.replace(
        /\\/g,
        "/"
      )}`;
    }

    // Update variant with new images
    const updatedVariant = await Variant.findByIdAndUpdate(
      id,
      {
        size,
        colorHex,
        colorName,
        frontImage: completeVariantImagePath1 || existingVariant.frontImage,
        midImage: completeVariantImagePath2 || existingVariant.midImage,
        lastImage: completeVariantImagePath3 || existingVariant.lastImage,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Variant updated successfully",
      data: updatedVariant,
    });
  } catch (error) {
    console.log("Error in updating variant", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
      data: deletedVariant,
    });
  } catch (error) {
    console.log("Error in deleting variant", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addVariant,
  getVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
};
