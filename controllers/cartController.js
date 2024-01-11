

const Cart = require('../models/cart');
const Product = require('../models/product');


const addToCart = async (req, res) => {
  try {
      const { product_id, quantity, total_price } = req.body;
     
      const user_id = req.userId;

      const product = await Product.findById(product_id);


      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let cart = await Cart.findOneAndUpdate(
          { user_id: user_id },
          {
              $push: { items: { product: product_id, quantity, total_price } }
          },
          { new: true, upsert: true }
      );

      res.status(201).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
      console.error('Error in adding to cart:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




module.exports = { addToCart };
