// routes/variantRoutes.js
const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const upload = require('../middlewares/multerConfig');

// Add Variant
router.post('/add-variant', upload.array('images', 3), variantController.addVariant);

// Get All Variants
router.get('/get-variants', variantController.getVariants);

// Get Variant by ID
router.get('/get-variant/:id', variantController.getVariantById);

// Update Variant by ID
router.put('/update-variant/:id', upload.array('images', 3), variantController.updateVariant);

// Delete Variant by ID
router.delete('/delete-variant/:id', variantController.deleteVariant);

module.exports = router;
