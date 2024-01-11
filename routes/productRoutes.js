const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/multerConfig');



router.post('/add-products',upload.array('images',3), productController.addProduct);

router.get('/get-products', productController.getProducts);

router.get('/get-products/:id', productController.getProductById);

router.get('/get-products-byCategory/:category_id', productController.getProductsByCategory);

router.put('/update-products/:id', productController.updateProduct);

router.delete('/delete-products/:id', productController.deleteProduct);



module.exports = router;
