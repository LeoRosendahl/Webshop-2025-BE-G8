import User from "../models/User.js";
import { auth } from "../middleware/auth";
import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

//funktion för att kunna lägga till innehåll mina sidor
router.post('/minasidor', auth, async(req, res) => {
    try {
        const { username, firstName, lastName, email, streetAddress, postalCode } = req.body

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.streetAddress = streetAddress;
            user.postalCode = postalCode;
            await user.save();
        res.status(200).json({ message: "User info added successfully" });
    } catch (error) {
        console.error("Error adding user info");
        res.status(500).json({ error: "Internal server error" });
    }
})

//funktion för att kunna ändra mina sidor.
router.put('/minasidor', auth, async (req, res) => {
    try {
        //istället för att deconstructa allting igen
        const { username, ...updateData } = req.body;

        const user = await User.findOneAndUpdate(
          { username },
          updateData,
          { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User info updated" });
    } catch (error) {
        console.error("Error updating user info" );
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;