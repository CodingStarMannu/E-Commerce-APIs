const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");



router.post('/register_admin', adminController.admin_register);

router.post('/login_admin', adminController.login_admin);






module.exports = router;
