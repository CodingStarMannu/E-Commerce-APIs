// routes/variantRoutes.js
const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const upload = require('../middlewares/multerConfig');


router.post('/add-variant', upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]), variantController.addVariant);

router.get('/get-variants', variantController.getVariants);

router.get('/get-variant/:id', variantController.getVariantById);

router.put('/update-variant/:id',upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]), variantController.updateVariant);

router.delete('/delete-variant/:id', variantController.deleteVariant);

module.exports = router;
