
const Cart = require('../models/cart');
const Product = require('../models/product');

const Order = require('../models/order');


const addToCart = async (req, res) => {
  try {
    const { product_id, quantity, price } = req.body;

    const user_id = req.userId;

    const product = await Product.findById(product_id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const total_price = price * quantity;

    let cart = await Cart.findOneAndUpdate(
      { user_id: user_id },
      {
        $push: { items: { product_id, quantity, total_price } },
      },
      { new: true, upsert: true }
    );
    // console.log({data:cart});

    res
      .status(201)
      .json({
        success: true,
        message: "Product added to cart successfully",
        cart,
      });
  } catch (error) {
    console.error("Error in adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { product_id, quantity, price } = req.body;
    const user_id = req.userId;

    const product = await Product.findById(product_id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // console.log("cart._doc.items:",cart._doc.items);

    const productIdToFind = product_id;

    const cartItem = cart.items.find(
      (item) =>
        item.product_id && item.product_id.toString() === productIdToFind
    ); //find is used to find the first element in the array that satisfies the condition returns undefined if not found

    if (cartItem) {
      cartItem.quantity = quantity || 1;
      cartItem.total_price = cartItem.quantity * price;
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    await cart.save();
    

    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updating cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not Found!" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== id);

    await cart.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Item removed from cart successfully",
        cart,
      });
  } catch (error) {
    console.error("Error in deleting item from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCartItem = async (req, res) => {
  try {
    const user_id = req.userId;

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, items: cart.items });
  } catch (error) {
    console.error("Error in getting items from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.error("Error in getting items from cart:", error);
  }
};

const getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cartItem = cart.items.find((item) => item._id.toString() === id);

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    res.status(200).json({ success: true, item: cartItem });
  } catch (error) {
    console.error("Error in getting item from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

    // const plceorder = async (req,res)=>{
    //   try {
    //     const { user_id } = req.params;
    
    //     // Find the user's cart
    //     const cart = await Cart.findOne({ user_id }).populate('items.product_id');
    
    //     if (!cart) {
    //       return res.status(404).json({ message: 'Cart not found' });
    //     }
    
    //     // Create an order object
    //     const order = new Order({
    //       user_id: cart.user_id,
    //       items: cart.items.map(item => ({
    //         product_id: item.product_id._id,
    //         quantity: item.quantity,
    //         total_price: item.total_price
    //       })),
    //       // You may add additional fields like shipping details, order status, etc.
    //     });
    
    //     // Calculate total order price
    //     const totalOrderPrice = cart.items.reduce((total, item) => total + item.total_price, 0);
    //     order.total_price = totalOrderPrice;
    
    //     // Save the order
    //     await order.save();
    
    //     // Clear the user's cart
    //     cart.items = [];
    //     await cart.save();
    
    //     res.status(201).json({ message: 'Order created successfully', order });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Server Error' });
    //   }

    // }

    // const plceorder = async (req, res) => {
    //   try {
    //     const { user_id } = req.params.userId; 
    
    //     // Find the user's cart
    //     const cart = await Cart.findOne({ user_id }).populate('items.product_id');
    
    //     if (!cart || !cart.items || cart.items.length === 0) {
    //       return res.status(404).json({ message: 'Cart not found or empty' });
    //     }
    
    //     // Create an order object
    //     const orderItems = cart.items.map(item => ({
    //       product_id: item.product_id._id,
    //       quantity: item.quantity,
    //       total_price: item.total_price
    //     }));
    
    //     const order = new Order({
    //       user_id: cart.user_id,
    //       items: orderItems,
    //       // You may add additional fields like shipping details, order status, etc.
    //     });
    
    //     // Calculate total order price
    //     const totalOrderPrice = cart.items.reduce((total, item) => total + item.total_price, 0);
    //     order.total_price = totalOrderPrice;
    
    //     // Save the order
    //     await order.save();
    
    //     // Clear the user's cart
    //     cart.items = [];
    //     await cart.save();
    
    //     res.status(201).json({ message: 'Order created successfully', order });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Server Error' });
    //   }
    // };
  
  
module.exports = {
  addToCart,
  updateCart,
  deleteCartItem,
  getCartItem,
  getCartItemById,
};
