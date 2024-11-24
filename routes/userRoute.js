const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} = require("../controllers/userController");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

router.get('/getuser', getUser);

// Logout user
router.post("/logout", logoutUser);

module.exports = router;
