const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, transfer, deposit, receive, send } = req.body;

  // console.log(req.body);
  

  // if (!name || !email || !password) {
  //   return res.status(400).json({ message: "Please fill all fields" });
  // }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      transfer,
      deposit,
      receive,
      send,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error during user registration:", error);

    // Differentiate between validation errors and general server errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error: " + error.message });
    }
    return res
      .status(500)
      .json({ message: "Server Error: Please try again later." });
  }
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Fetch all users
const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field from the response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, transfer, deposit, receive, send } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields dynamically if provided in the request
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Hashing recommended if not already handled
    if (transfer) user.transfer = transfer;
    if (deposit) user.deposit = deposit;
    if (receive) user.receive = receive;
    if (send) user.send = send;

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// fetch user details
const fetchUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Logout user (simply removing token on the frontend)
const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  fetchUser,
  updateUser,
  fetchAllUsers,
};
