const mongoose =  require("mongoose")


const wishlistItemSchema = new mongoose.Schema({

user_id:{
    type:String,
    require:true
},
//     product_id:{type:String,
//         ref: 'Product',
//     require:true},
// },
product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' },
product: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Product' }, 
})
const WishListItem = mongoose.model("WishListItem ",wishlistItemSchema)



module.exports = WishListItem


// const mongoose = require('mongoose');

// const wishlistSchema = new mongoose.Schema({
//   product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Add this line to define the 'product' field
//   // Other wishlist fields
// });

// const Wishlists = mongoose.model('Wishlists', wishlistSchema);

// module.exports = Wishlists;
