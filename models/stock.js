const mongoose = require("mongoose");

const inStockSchema = new mongoose.Schema(
  {
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
      required: true,
    },
    instock: {
      type: Boolean,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const InStock = mongoose.model("InStock", inStockSchema);

module.exports = InStock;
