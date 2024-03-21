const User = require("../models/user");
require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const Wishlists = require("../models/wishlist");
const Products = require("../models/product");
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

const register_user = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      return res.status(401).json({
        success: false,
        msg: "This email is already registered. Please use another email.",
      });
    }
    const safePassword = await securePassword(req.body.password);

    const user = await User.create({
      email: req.body.email,
      password: safePassword,
    });
    const user_data = await user.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user_data,
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

const login_user = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Incorrect email or password please check",
      });
    }
    const user_id = user._id;
    console.log(user_id);

    const token = generateAuthToken(user_id);

    user.token = token;
    await user.save();

    return res
      .status(200)
      .json({ success: true, msg: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const save_user_data = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    let updatedFields = {
      name: req.body.name || existingUser.name,
      phoneNumber: req.body.phoneNumber || existingUser.phoneNumber,
    };

    if (req.files && req.files["image"]) {

      const baseUrl = "https://e-commerce-apis-mch4.onrender.com/";
    // const baseUrl = "http://localhost:3001/";
    const profileImage = path.join(
        "images",
        req.files["image"][0].filename
      );
      const completeProfileImage = `${baseUrl}${profileImage.replace(
        /\\/g,
        "/"
      )}`;
      updatedFields.image = completeProfileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to update user" });
    }

    return res.status(200).json({
      success: true,
      msg: "User data saved successfully.",
      data: updatedFields,
    });
  } catch (error) {
    console.error("Error in saving user data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const logout_user = async (req, res) => {
  try {

    const token = req.header("Authorization").replace("Bearer ", "");

    await req.user.updateOne({ $pull: { tokens: { token } } });

    res.status(200).json({
      success: true,
      message: "User logout successful",
    });
  } catch (error) {
    console.log("Error in user logout", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    console.log("req.body", req.body);
    console.log("user", user);
    const isMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }
    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

          // Create a reset token with a timestamp (valid for 10 minutes)
          const resetToken = jwt.sign({ userId: user._id, timestamp: Date.now() }, process.env.SECRET_KEY, { expiresIn: '10m' });

          const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        console.log(resetLink); 

        const emailSubject = 'Click On The Link To Reset PassWord';
        const emailBody = `
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          .greeting {
            color: pink;    
            font-size: 18px;
            margin-bottom: 10px;
          }
          .instructions {
            margin-bottom: 20px;
          }
          .reset-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
          .reset-link:hover {
            background-color: #0056b3;
          }
        </style>
        <div class="container">
          <p class="greeting">${user.name ? `Hi ${user.name},` : 'Dear Customer,'}</p>
          <p class="instructions">Please click the link below to reset your password:</p>
          <p class="instructions">This Link is valid for one time and for 10 mins only</p>
          <a class="reset-link" href="${resetLink}">${resetLink}</a>
        </div>
      `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: emailSubject,
            html: emailBody
        };
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

       const info=  await transporter.sendMail(mailOptions);
       console.log("Mail has been sent:-" ,info.response);

        res.status(200).json({ success: true, message: 'Please check your inbox for the password reset link.',id:user.id });
    } catch (error) {
        console.error('Error in forgetting password:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



const verifyToken = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const currentTimestamp = Date.now();
        const tokenTimestamp = decoded.timestamp;
        const tokenExpiration = 10 * 60 * 1000; // 10 minutes in milliseconds

        if (currentTimestamp - tokenTimestamp > tokenExpiration) {
            return res.status(401).json({ success: false, message: 'Token has expired' });
        }

        res.status(200).json({ success: true, message: 'Token is valid', userId: decoded.userId });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and newPassword are required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // Find the user by id
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            user.password = await securePassword(newPassword);
            await user.save();

            return res.status(200).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ success: false, message: 'Token has expired' });
            } else {
                throw error; 
            }
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Add to Wish list

const addToWishlist = async (req, res) => {
  try {
    const user_id = req.userId;
    const { product_id } = req.body;

    // Check if the product is already in the user's wishlist
    const existingItem = await Wishlists.findOne({
      user_id: user_id,
      product_id: product_id,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in wishlist." });
    }

    // Add the product to the user's wishlist
    const newItem = await Wishlists.create({
      user_id: user_id,
      product_id: product_id,
    });

    res.status(201).json({
      message: "Product added to wishlist successfully.",
      data: newItem,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist." });
  }
};

const getWishlists = async (req, res) => {
  try {
    // Get the user's wishlist items
    const user_id = req.userId;
    if (!user_id) {
      return res
        .status(400)
        .json({ error: "User ID is missing in the request" });
    }

    const product_id = req.body;
    if (!product_id) {
      return res
        .status(400)
        .json({ error: "Product ID is missing in the request" });
    }
    // Find wishlist items for the given user_id and populate the associated product details
    const wishListItems = await Wishlists.find({ user_id: user_id }).populate({
      path: "product_id",
      model: Products, // Assuming 'Product' is the name of your product model
    });

    res.status(200).json({ data: wishListItems });
    if (!wishListItems) {
      return res
        .status(400)
        .json({ error: "Wishlist Item is missing in the request" });
    }
  } catch (error) {
    console.error("Error fetching wishlist", error);
    res.status(500).json({ message: "Error fetching wishlist." });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    // Check if userId is present in the request
    const user_Id = req.userId;
    if (!user_Id) {
      return res
        .status(400)
        .json({ error: "User ID is missing in the request" });
    }

    // Check if productId is present in the request body
    const productId = req.body.product_id;
    if (!productId) {
      return res
        .status(400)
        .json({ error: "Product ID is missing in the request body" });
    }

    // Remove the wishlist item based on userId and productId
    const result = await Wishlists.findOneAndDelete({
      user_id: user_Id,
      product_id: productId,
    });

    if (!result) {
      return res.status(404).json({ error: "Item not found in the wishlist" });
    }

    res.status(200).json({ result: "Item removed from wishlist successfully" });
  } catch (error) {
    console.error("Error deleting from wishlist", error);

    // Check if the error is due to invalid ObjectId
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    res.status(500).json({ message: "Error in deleting from wishlist" });
  }
};

module.exports = {
  login_user,
  register_user,
  save_user_data,
  logout_user,
  resetPassword,
  changePassword,
  forgetPassword,
  verifyToken,
  addToWishlist,
  getWishlists,
  removeFromWishlist,
};
