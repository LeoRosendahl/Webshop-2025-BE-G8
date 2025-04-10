import User from "../models/User";
import { auth } from "../middleware/auth";
import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

//funktion för att kunna lägga till innehåll mina sidor
router.post('/minasidor', async (req, res) => {
    try {
        const { username, firstName, lastName, email, streetAddress, postalCode } = req.body

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
            user.firstName = firstName,
            user.lastName = lastName,
            user.email = email,
            user.streetAddress = streetAddress,
            user.postalCode = postalCode,
            await user.save();
        res.status(200).json({ message: "User info added successfully" });
    } catch (error) {
        console.error("Error adding user info");
        res.status(500).json({ error: "Internal server error" });
    }
})

//funktion för att kunna ändra mina sidor.
router.put('/minasidor', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User info updated", user });
    } catch (error) {
        console.error("Error updating user info", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;