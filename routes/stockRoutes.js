const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const adminController = require("../controllers/adminController");

router.post("/addStockStatus", adminController.addStockStatus);
router.post("/updateStockStatus", adminController.updateStockStatus);
router.post("/addImage", upload.single("image"), adminController.addImage);
router.get("/getInStock/:product_id", adminController.getInStockByProductId);
router.delete("/deleteInStock/:stock_id", adminController.deleteInStockById);

module.exports = router;
