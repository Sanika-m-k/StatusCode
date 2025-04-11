// server/controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify user and create if not exists
const verifyUser = async (req, res) => {
  try {
    // Auth0 token is already verified by middleware
    // Extract user info from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    
    // Get userId from token
    const userId =  decodedToken.sub;
    console.log("userId", userId);
    if (!userId) {
      return res.status(400).json({ message: 'userId not found in token' });
    }

    // Check if user exists
    let user = await User.findOne({ userId });

    // If user doesn't exist, create new user
    console.log("user", user);
    if (!user) {
      user = new User({
        userId,
        name: decodedToken.name || userId,
        // Add any other fields you need
      });
      try {
        await user.save();
        console.log("User saved:", user);
      } catch (saveErr) {
        console.error("Error saving user:", saveErr);
      }
      
    }

    // Return user info
    console.log("user found");
    return res.status(200).json({ 
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name
      } 
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyUser };