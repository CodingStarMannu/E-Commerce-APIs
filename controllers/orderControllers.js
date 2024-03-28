const Cart = require('../models/cart');

const Order = require('../models/order');



const placeOrder = async (req, res) => {
    try {
      const { shippingAddress1, shippingAddress2, city, state, country, pincode } = req.body;
      const { userId } = req.params; // Use req.params.userId if the userId is in the URL params
  
      // Find the user's cart
      const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Create an order object
      const order = new Order({
        user_id: cart.user_id,
        items: cart.items.map(item => ({
          product_id: item.product_id._id,
          quantity: item.quantity,
          total_price: item.total_price,
          shippingAddress1: shippingAddress1,
          shippingAddress2: shippingAddress2,
          city: city,
          state: state,
          country: country,
          pincode: pincode
        })),
        // You may add additional fields like shipping details, order status, etc.
      });
  
      // Calculate total order price
      const totalOrderPrice = cart.items.reduce((total, item) => total + item.total_price, 0);
      order.total_price = totalOrderPrice;
  
      // Save the order
      await order.save();
  
      // Clear the user's cart
      cart.items = [];
      await cart.save();
  
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  
  const deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      // Check if the order exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
      
      // Delete the order
      await order.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const getAllOrders = async (req, res) => {
    try {
      // Find all orders
      const orders = await Order.find();
  
    //   // Check if any orders are found
    //   if (!orders || orders.length === 0) {
    //     return res.status(404).json({ success: false, error: "No orders found" });
    //   }
  
      // Respond with the orders
      res.status(200).json({
        success: true,
        message: "All orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const getOrderById = async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      // Find the order by ID
      const order = await Order.findById(orderId);
  
      // Check if the order exists
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
  
      // Respond with the order
      res.status(200).json({
        success: true,
        message: "Order found",
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  module.exports = {  placeOrder, deleteOrder ,getAllOrders ,getOrderById };
