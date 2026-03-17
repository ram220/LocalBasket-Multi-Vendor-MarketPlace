const express=require('express');
const authControllers=require('../controllers/authControllers');
const {uploadAgent}=require('../controllers/authControllers');

const router=express.Router();

router.post("/register-user",authControllers.registerUser);
router.post("/login-user",authControllers.loginUser);
router.post("/register-vendor",authControllers.uploadVendor.single("shopImage"),authControllers.registerVendor);
router.post("/login-vendor",authControllers.loginVendor);
router.post("/register-admin",authControllers.registerAdmin);
router.post("/login-admin",authControllers.loginAdmin);
router.post('/register-agent',uploadAgent.fields([{name:"aadhaarImage",maxCount:1},{name:"selfieImage",maxCount:1}]),authControllers.registerDeliveryAgent);
router.post("/login-agent",authControllers.loginDeliveryAgent);
router.post("/forgot-password", authControllers.forgotPassword);

router.post("/reset-password/:token/:role", authControllers.resetPassword);

module.exports=router;