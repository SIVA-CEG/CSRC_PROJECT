const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  findUserId,
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


module.exports = router;
