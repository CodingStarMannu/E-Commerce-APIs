const Banner = require("../models/Banner");
const InStock = require("../models/stock");

const addBanner = async (req, res) => {
  try {
    const { image1, image2, image3 } = req.files;

    // Create a new banner entry in the database
    const newBanner = new Banner({
      image1: image1 ? image1[0].filename : null,
      image2: image2 ? image2[0].filename : null,
      image3: image3 ? image3[0].filename : null,
      banner_id: 1,
    });

    await newBanner.save();

    res
      .status(201)
      .json({ message: "Banner added successfully.", data: newBanner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Error adding banner." });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { image1, image2, image3 } = req.files;

    // Find the last existing banner with banner_id = 1
    const lastBanner = await Banner.findOne({ banner_id: 1 }).sort({
      createdAt: -1,
    });

    if (!lastBanner) {
      return res
        .status(404)
        .json({ message: "No banner found for the specified banner_id." });
    }

    // Update the images for the last banner
    lastBanner.image1 = image1 ? image1[0].filename : lastBanner.image1;
    lastBanner.image2 = image2 ? image2[0].filename : lastBanner.image2;
    lastBanner.image3 = image3 ? image3[0].filename : lastBanner.image3;

    // Save the changes to the database
    await lastBanner.save();

    res
      .status(200)
      .json({ message: "Banner updated successfully.", data: lastBanner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Error updating banner." });
  }
};

const getBanner = async (req, res) => {
  try {
    const getBanner = await Banner.findOne({ banner_id: 1 }).sort({ _id: -1 });

    if (!getBanner) {
      return res
        .status(404)
        .json({ message: "Active announcement form not found." });
    }

    res.status(200).json({ data: getBanner });
  } catch (error) {
    console.error("Error fetching getBanner form:", error);
    res.status(500).json({ message: "Error fetching getBanner form." });
  }
};

const addStockStatus = async (req, res) => {
  try {
    const { instock, product_id } = req.body;
    const newStockStatus = await InStock.create({ instock, product_id });
    res
      .status(201)
      .json({
        message: "Stock status added successfully",
        data: newStockStatus,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStockStatus = async (req, res) => {
  try {
    const { stock_id, instock, product_id } = req.body;
    if (!stock_id) {
      return res.status(400).json({ error: "Stock ID is required" });
    }
    const updatedStockStatus = await InStock.findByIdAndUpdate(
      stock_id,
      { instock, product_id },
      { new: true }
    );
    res.json({
      message: "Stock status updated successfully",
      data: updatedStockStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addImage = async (req, res) => {
  try {
    const { product_id } = req.body;
    const image = req.file?.path;
    if (!product_id || !image) {
      return res
        .status(400)
        .json({ error: "Product ID and image are required" });
    }
    await InStock.findOneAndUpdate({ product_id }, { image }, { new: true });
    res.json({ message: "Image added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInStockByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;
    const inStock = await InStock.findOne({ product_id });
    if (!inStock) {
      return res
        .status(404)
        .json({ message: "InStock not found for the specified product_id." });
    }
    res.json(inStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteInStockById = async (req, res) => {
  try {
    const { stock_id } = req.params;
    const deletedInStock = await InStock.findByIdAndDelete(stock_id);
    if (!deletedInStock) {
      return res
        .status(404)
        .json({ message: "InStock not found for the specified stock_id." });
    }
    res.json({ message: "InStock deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addBanner,
  getBanner,
  updateBanner,
  addStockStatus,
  updateStockStatus,
  addImage,
  getInStockByProductId,
  deleteInStockById,
};
