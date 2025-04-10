import express, { application } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';



const router = express.Router();

// Skapar JWT-token och en expireAccess-token tid på 15min.

// Register
// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Gör denna användare till admin
    /* let adminStatus = false; */

    // Skapa ny användare med isAdmin = true. om vi vill skapa en till admin användare, sätt adminStatus: true i newUser (efter password)
    const newUser = new User({ username, password });
    await newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );
    //Vi lägger refreshToken utanför för att återanvända de.
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '7d' }
    )
    res.status(201).json({ user: newUser, accessToken, refreshToken });
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
    const accessToken = jwt.sign(
      {
        id: user._id, isAdmin:
          user.isAdmin,
        username: user.username
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );
    //Vi lägger refreshToken utanför för att återanvända de.
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '7d' }
    )
    res.json({ user, refreshToken, accessToken })

  } catch (error) {
    console.error("Error signing in user", error);
    res.status(500).json({ error: "Internal server error" });

  }

  router.post('/refresh', (req, res) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" })
      }

      jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (error, decoded) => {
        if (error) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Om refresh token är giltig, skapa ett nytt access token
        const accessToken = jwt.sign(
          { id: decoded.id, isAdmin: decoded.isAdmin },
          process.env.JWT_SECRET || 'your-access-secret', // Se till att använda rätt JWT_SECRET här
          { expiresIn: '15m' }
        );

        res.json({ accessToken });
      });
    } catch (error) {
      console.error("Error refreshing token", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  // jämför lösenord
  /* const isMatch = await User.comparePassword(password);
   if (!isMatch) {
     return res.status(400).json({ error: "Invalid credentials" });
   } */
})


export default router;