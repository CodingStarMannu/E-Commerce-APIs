const express = require('express');
const router = express.Router();


router.use('/user', require('./userRoutes'));
router.use('/user', require('./cartRoutes'));

router.use('/admin', require('./categoryRoutes'));
router.use('/admin', require('./productRoutes'));
router.use('/admin', require('./variantRoutes'));
router.use('/admin', require('./bannerRoutes'));
router.use('/admin', require('./stockRoutes'));



module.exports = router;