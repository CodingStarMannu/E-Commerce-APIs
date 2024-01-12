

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
      // console.log("cart._doc.items:",cart._doc.items);

      const productIdToFind = product_id;

      const cartItem = cart.items.find(item => item.product_id && item.product_id.toString() === productIdToFind);//find is used to find the first element in the array that satisfies the condition returns undefined if not found

      // if (cartItem) {
      //     console.log('Item found:', cartItem);
      // } else {
      //     console.log('Item not found');
      // }

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


const deleteCartItem = async (req,res)=>{

  try {

    const{id} = req.params;
    const user_id = req.userId;
    let cart =  await Cart.findOne({user_id});

    if(!cart){
      return res.status(404).json({success:false, message:'Cart not Found!'});
    }

    // const itemIndex = cart.item.findIndex(item=>item._id.toString()===id);//The findIndex method is similar to find, but it returns the index of the first element that satisfies the testing function, or -1 if no such element is found

    // if (itemIndex === -1) {
    //   return res.status(404).json({ success: false, message: 'Item not found in cart' });
    // }

    // cart.items.splice(itemIndex,1);

    cart.items = cart.items.filter(item => item._id.toString() !== id);

    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error in deleting item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getCartItem = async (req, res) => {
  try {
    const user_id = req.userId;

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, items: cart.items });
  } catch (error) {
    console.error('Error in getting items from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => item._id.toString() === id);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    res.status(200).json({ success: true, item: cartItem });
  } catch (error) {
    console.error('Error in getting item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { addToCart, updateCart, deleteCartItem, getCartItem, getCartItemById };
