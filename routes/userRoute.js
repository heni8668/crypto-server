const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout user
router.post("/logout", logoutUser);

module.exports = router;
