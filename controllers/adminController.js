const Banner = require("../models/banner");
const InStock = require("../models/stock");
const Admin = require("../models/admin");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log("Error in securing password with");
  }
};

const generateAuthToken = (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  return token;
};

const admin_register = async (req, res) => {
  try {
    const { name, password } = req.body;

    const safePassword = await securePassword(password);

    const admin = await Admin.create({
      name: name,
      password: safePassword,
    });

    const admin_data = await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully,",
      data: admin_data,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Duplicate key error. Email already exists.",
      });
    }
    console.error("Error in registering user", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login_admin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ name: name });

    if (!admin) {
      return res.status(401).json({ success: false, msg: "Admin not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Incorrect name or password please check",
        });
    }
    const admin_id = admin._id;

    const token = generateAuthToken(admin_id);

    admin.token = token;
    await admin.save();

    return res
      .status(200)
      .json({ success: true, msg: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addBanner = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Construct image paths
    const bannerImagePath1 = path.join(
      "images",
      req.files["image1"][0].filename
    );
    const bannerImagePath2 = path.join(
      "images",
      req.files["image2"][0].filename
    );
    const bannerImagePath3 = path.join(
      "images",
      req.files["image3"][0].filename
    );

    // Construct complete image paths with the new base URL
    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";

    const completeBannerImagePath1 = `${baseUrl}${bannerImagePath1.replace(
      /\\/g,
      "/"
    )}`;
    const completeBannerImagePath2 = `${baseUrl}${bannerImagePath2.replace(
      /\\/g,
      "/"
    )}`;
    const completeBannerImagePath3 = `${baseUrl}${bannerImagePath3.replace(
      /\\/g,
      "/"
    )}`;

    // Create a new banner entry in the database
    const newBanner = await Banner.create({
      image1: completeBannerImagePath1,
      image2: completeBannerImagePath2,
      image3: completeBannerImagePath3,
      banner_id: 1,
    });
    await newBanner.save();
    res.status(201).json({
      message: "Banner added successfully.",
      data: {
        image1: completeBannerImagePath1,
        image2: completeBannerImagePath2,
        image3: completeBannerImagePath3,
      },
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Error adding banner." });
  }
};

const updateBanner = async (req, res) => {
  try {

    // Find the last existing banner with banner_id = 1
    const existingBanner = await Banner.findOne({ banner_id: 1 }).sort({
      createdAt: -1,
    });

    if (!existingBanner) {
      return res
        .status(404)
        .json({ message: "No banner found for the specified banner_id." });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

  
    // Construct image paths
    const bannerImagePath1 = path.join(
      "images",
      req.files["image1"][0].filename
    );
    const bannerImagePath2 = path.join(
      "images",
      req.files["image2"][0].filename
    );
    const bannerImagePath3 = path.join(
      "images",
      req.files["image3"][0].filename
    );

    // Construct complete image paths with the new base URL
    // const baseUrl = "http://localhost:3001/";
    const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";


    const completeBannerImagePath1 = `${baseUrl}${bannerImagePath1.replace(
      /\\/g,
      "/"
    )}`;
    const completeBannerImagePath2 = `${baseUrl}${bannerImagePath2.replace(
      /\\/g,
      "/"
    )}`;
    const completeBannerImagePath3 = `${baseUrl}${bannerImagePath3.replace(
      /\\/g,
      "/"
    )}`;

    // Update the existing banner entry in the database
    existingBanner.image1 = completeBannerImagePath1;
    existingBanner.image2 = completeBannerImagePath2;
    existingBanner.image3 = completeBannerImagePath3;

    await existingBanner.save();

    res.status(200).json({
      message: "Banner updated successfully.",
      data: {
        image1: completeBannerImagePath1,
        image2: completeBannerImagePath2,
        image3: completeBannerImagePath3,
      },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Error updating banner." });
  }
}

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
    res.status(201).json({
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
  admin_register,
  login_admin,
  addBanner,
  getBanner,
  updateBanner,
  addStockStatus,
  updateStockStatus,
  addImage,
  getInStockByProductId,
  deleteInStockById,
};
