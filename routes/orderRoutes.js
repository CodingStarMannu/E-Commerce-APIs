express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');




router.post('/order/:userId' , orderController.placeOrder);

router.delete('/delete-orders/:orderId', orderController.deleteOrder);

router.get('/get-all-orders', orderController.getAllOrders);

router.get('/get-order-by-id/:orderId',orderController.getOrderById)

module.exports = router;