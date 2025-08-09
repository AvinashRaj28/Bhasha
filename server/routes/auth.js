//Description: This file contains the API routes for user registration and login.
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
// Register a new user
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User with this email already exists' });
      }
  
      // Create a new user instance (password will be hashed by the pre-save hook)
      user = new User({
        username,
        email,
        password,
      });
  
      // Save the user to the database
      await user.save();
  
      // --- Create and return a JSON Web Token (JWT) ---
      const payload = {
        user: {
          id: user.id, // Mongoose uses 'id' as a virtual getter for '_id'
        },
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' }, // Token expires in 5 hours
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token }); // Respond with the token
        }
      );
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  
  // --- Login Route ---
  // @route   POST /api/auth/login
  // @desc    Authenticate user & get token
  // @access  Public
  router.post('/login', async (req, res) => {
      const { email, password } = req.body;
  
      try {
          // Check if the user exists
          let user = await User.findOne({ email });
          if (!user) {
              return res.status(400).json({ msg: 'Invalid credentials' });
          }
  
          // Compare the entered password with the stored hashed password
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
              return res.status(400).json({ msg: 'Invalid credentials' });
          }
  
          // --- User is valid, create and return JWT ---
          const payload = {
              user: {
                  id: user.id,
              },
          };
  
          jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: '5h' },
              (err, token) => {
                  if (err) throw err;
                  res.json({ token });
              }
          );
  
      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
  });
  
  
  module.exports = router;