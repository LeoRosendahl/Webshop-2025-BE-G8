import express from "express";
import { Product, Category } from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();


// ------ CategorySchema functions for frontend POST,GET,PUT,DELETE-------
//         LÄGG TILL ADMINAUTH!!!!
router.post("/",async (req,res) => {
    try {
      const {name} = req.body;
  
      let category = await Category.findOne({name});
  
      //tittar om det redan finns i databasen (error code 409 betyder att datan redan finns i databasen)
      if (!category){
        category = await Category.create({ name });
        res.status(201).json(category);
      } else {
        res.status(409).json({ error: "Category already exists" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  })
  
  // GET för att hämta categories
  router.get("/", async ( req, res) => {
    try { 
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories"});
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ errror: "Failed to fetch category"});
    }
  });
  
  // delete funktion för kategorier, LÄGG TILL ADMINAUTH
  router.delete("/", async (req,res) => {
    try {
      const categories = await Category.deleteMany({});
      res.status(200).json({message: `${categories.deletedCount} categories deleted`});
    } catch (error) {
      res.status(500).json({error: "Failed to delete categories"});
    }
  });
  
  // delete funktion för kategorier:ID    LÄGG TILL ADMINAUTH
  router.delete("/:id", async (req,res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
  
      if (!category) {
        return res.status(400).json({error: "Could not find category"});
      } 
      res.status(200).json(category);
    } catch(error) {
      res.status(500).json({error: "Failed to delete categroy"});
    }
  });
  
  // uppdatering av kategorier   LÄGG TILL ADMINAUTH
  router.put("/:id", async (req,res) => {
    try{
      const {name} = req.body
      const category = await Category.findByIdAndUpdate(req.params.id,{name}, {new: true});
  
      //tittar om kategorien finns
      if(!category) {
        return res.status(400).json({error: "Could not find category"});
      }
      res.status(200).json(category);
  
    } catch(error) {
      res.status(500).json({error: "Failed to update category"});
    }
  });
  export default router;