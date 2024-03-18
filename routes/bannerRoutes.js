const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const adminController = require("../controllers/adminController");

router.post(
  "/addBanner",
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  adminController.addBanner
);
router.get("/getBanner", adminController.getBanner);
router.post(
  "/updateBanner",
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  adminController.updateBanner
);

module.exports = router;
