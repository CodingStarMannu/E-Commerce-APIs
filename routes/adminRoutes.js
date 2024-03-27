const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post('/register_admin', adminController.admin_register);

router.post('/login_admin', adminController.login_admin);
router.get('/getAllUsersList', adminController.getAllUsersList);
router.delete('/deleteUserbyadmin/:userId', adminController.deleteUserbyadmin);



module.exports = router;
