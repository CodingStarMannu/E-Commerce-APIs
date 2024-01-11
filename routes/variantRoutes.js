// routes/variantRoutes.js
const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const upload = require('../middlewares/multerConfig');


router.post('/add-variant', upload.array('images', 3), variantController.addVariant);

router.get('/get-variants', variantController.getVariants);

router.get('/get-variant/:id', variantController.getVariantById);

router.put('/update-variant/:id', upload.array('images', 3), variantController.updateVariant);

router.delete('/delete-variant/:id', variantController.deleteVariant);

module.exports = router;
