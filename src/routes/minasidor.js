import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

//funktion för att kunna lägga till innehåll mina sidor
router.get('/', auth, async(req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id).select("-password")
        return res.json({user})

    } catch (error) {
        console.error("Error adding user info");
        res.status(500).json({ error: "Internal server error" });
    }
})

//funktion för att kunna ändra mina sidor.
router.put('/', auth, async (req, res) => {
    try {
        const id = req.user.id
        //istället för att deconstructa allting igen
        const updateData = req.body;
        delete updateData._id
        delete updateData.password

        const user = await User.findOneAndUpdate(
          { _id: id },
          {
            $set: updateData
          },
          { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User info updated", user });
    } catch (error) {
        console.error("Error updating user info" );
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;