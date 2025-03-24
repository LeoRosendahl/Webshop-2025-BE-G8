import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read products JSON file
// const productsJSON = JSON.parse(
//readFileSync(join(__dirname, "../data/products.json"), "utf8")
// );



// Get all products. Route is defined in routes, hence empty ("/").
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});


//TODO Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      throw new Error("Product not found");
    }
    res.status(200).json(product);

  } catch (error) {
    res.status(404).json({ error: "Failed fetching product" })
  }


})
// Create product (admin only). Until we've fixed adminAuth we'll commment this out and create a nonAdmin post.

/* router.post("/", adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
 */
//Created post.   
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//TODO Update product (admin only)

//TODO Delete product (admin only)

export default router;
