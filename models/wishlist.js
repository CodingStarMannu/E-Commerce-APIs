const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});
const WishListItem = mongoose.model("WishListItem ", wishlistItemSchema);

module.exports = WishListItem;


