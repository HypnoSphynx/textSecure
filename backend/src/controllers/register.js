import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};



// Register User
export const register = async (req, res) => {
  try {
    const { username, email, password, birthdate, mobileNumber, district } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this username or email already exists"
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      birthdate: new Date(birthdate),
      mobileNumber,
      district
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get decrypted user data for response
    const userData = user.decryptUserData();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};