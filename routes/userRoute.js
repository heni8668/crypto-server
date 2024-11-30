const express = require("express");
const {
  registerUser,
  loginUser,
  fetchAllUsers,
  fetchUser,
  updateUser,
  deleteUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);
router.get("/", fetchAllUsers);
router.get("/:id", fetchUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);



// Logout user
router.post("/logout", logoutUser);

module.exports = router;
