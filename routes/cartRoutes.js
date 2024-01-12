express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');



router.post('/add-to-cart' , authMiddleware, cartController.addToCart);

router.patch('/updateCart', authMiddleware, cartController.updateCart);

module.exports = router;    