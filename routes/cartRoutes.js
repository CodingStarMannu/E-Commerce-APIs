express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');



router.post('/add-to-cart' , authMiddleware, cartController.addToCart);

router.patch('/update-cart', authMiddleware, cartController.updateCart);

router.delete('/delete-item-cart/:id', authMiddleware, cartController.deleteCartItem);

module.exports = router;