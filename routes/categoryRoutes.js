const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const upload = require("../middlewares/multerConfig");

router.post(
  "/create-categories",
  upload.fields([{ name: "image" }]),
  categoryController.createCategory
);
router.get("/get-categories", categoryController.getCategories);
router.get("/get-categories/:id", categoryController.getCategoryById);
router.put(
  "/update-categories/:id",
  upload.fields([{ name: "image" }]),
  categoryController.updateCategory
);
router.delete("/delete-categories/:id", categoryController.deleteCategory);

module.exports = router;
