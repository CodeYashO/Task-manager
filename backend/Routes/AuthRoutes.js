const express = require("express");
const {register , login , verifyOtp , forgotPassword , resetPassword , verifyToken} = require("../Controllers/AuthController")
const router = express.Router();

router.post('/register' , register);
router.post('/verify-otp' , verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/verify-token', verifyToken);

module.exports = router;