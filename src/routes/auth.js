import express, { application } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';



const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//TODO Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({user})
  } catch (error){
    console.error("Error signing in user", error);
    res.status(500).json({error: "Internal server error"});

  }
  // jämför lösenord
 /* const isMatch = await User.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  } */
})


export default router;