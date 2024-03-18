const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/multerConfig');



router.post('/add-products', upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]), productController.addProduct);

router.get('/get-products', productController.getProducts);

router.get('/get-products/:id', productController.getProductById);

router.get('/get-products-byCategory/:category_id', productController.getProductsByCategory);

router.put('/update-products/:id', upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]), productController.updateProduct);

router.delete('/delete-products/:id', productController.deleteProduct);



module.exports = router;
