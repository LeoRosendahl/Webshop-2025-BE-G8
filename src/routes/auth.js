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
  const user = await user.findOne({username: req.body.username})
  if (!user) {
    return res.status(404).send('User not found')
  }
  
  try {
    if (userSchema.methods.comparePassword = async function (candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }) {
    }
    res.send('Success')
  } catch {
    res.send('Not Allowed')
  }
})

export default router;