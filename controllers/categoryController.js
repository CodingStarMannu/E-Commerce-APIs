const Category = require("../models/category");
const path = require("path");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.files || !req.files["image"]) {
      return res.status(400).json({ message: "No Image was uploaded." });
    }

    const categoryImage = path.join("images", req.files["image"][0].filename);

    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    const completeCategoryImage = `${baseUrl}${categoryImage.replace(
      /\\/g,
      "/"
    )}`;
    const newCategory = await Category.create({
      name,
      description,
      image: completeCategoryImage,
    });

    res.status(201).json({
      success: true,
      message: "Category created Successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("Error in creating category", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "All Categories retrieved Successfully",
      data: categories,
    });
  } catch (error) {
    console.log("Error in getting categories", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved Successfully",
      data: category,
    });
  } catch (error) {
    console.log("Error in getting category by ID", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let categoryImage = existingCategory.image;

    if (req.files && req.files["image"]) {
      categoryImage = path.join("images", req.files["image"][0].filename);
    }

    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    const completeCategoryImage = `${baseUrl}${categoryImage.replace(
      /\\/g,
      "/"
    )}`;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, image: completeCategoryImage },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.log("Error in deleting category by ID", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
