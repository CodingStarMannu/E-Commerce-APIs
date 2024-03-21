const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");

router.post("/register", user.register_user);
router.post("/login", user.login_user);
router.post(
  "/save_data",
  upload.fields([{ name: "image" }]),
  authMiddleware,
  user.save_user_data
);

router.patch("/logout", authMiddleware, user.logout_user);

router.post("/change-password", authMiddleware, user.changePassword);

router.post("/forget-password", user.forgetPassword);
router.get("/verify-token", user.verifyToken);
router.post("/reset-password", user.resetPassword);

router.post("/addToWishList", authMiddleware, user.addToWishlist);
router.get("/getWishlists", authMiddleware, user.getWishlists);
router.delete("/remove-from-wishlist", authMiddleware, user.removeFromWishlist);

module.exports = router;
