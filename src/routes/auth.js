import express, { application } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';



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
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if (!user){
    return res.status(404).json({error: "User not found"});
  }

  // jämför lösenord
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({error: "Invalid credentials"});
  }
})


module.exports = router;

export default router;