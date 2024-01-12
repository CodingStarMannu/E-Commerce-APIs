

const Cart = require('../models/cart');
const Product = require('../models/product');


const addToCart = async (req, res) => {
  try {
      const { product_id, quantity, price } = req.body;
     
      const user_id = req.userId;

      const product = await Product.findById(product_id);


      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const total_price = price * quantity;

      let cart = await Cart.findOneAndUpdate(
          { user_id: user_id },
          {
              $push: {  items: { product_id, quantity, total_price } }
          },
          { new: true, upsert: true }
      );
      // console.log({data:cart});

      res.status(201).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
      console.error('Error in adding to cart:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const updateCart = async (req, res) => {
  try {
      const { product_id, quantity, price } = req.body;
      const user_id = req.userId;

      const product = await Product.findById(product_id);

      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let cart = await Cart.findOne({ user_id });

      if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
      }
      console.log("cart._doc.items:",cart._doc.items);

      const productIdToFind = product_id; // Replace this with the actual product_id you're looking for

      const cartItem = cart.items.find(item => item.product_id && item.product_id.toString() === productIdToFind);

      if (cartItem) {
          console.log('Item found:', cartItem);
      } else {
          console.log('Item not found');
      }

      // const cartItem = cart._doc.items.find(item => item.product_id === product_id || item.product === product_id);
      // console.log("cartItem",cartItem);

      if (cartItem) {
          cartItem.quantity = quantity || 1;
          cartItem.total_price = cartItem.quantity * price;
      } else {
          return res.status(404).json({ success: false, message: 'Product not found in cart' });
      }

      await cart.save();

      res.status(200).json({ success: true, message: 'Cart updated successfully', cart });
  } catch (error) {
      console.error('Error in updating cart:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




module.exports = { addToCart, updateCart};
