const express = require("express");

const {
  register,
  login,
  findUserId,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
} = require("../controllers/authcontrollers");

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// FIND USER ID
router.post("/find-userid", findUserId);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

module.exports = router;
