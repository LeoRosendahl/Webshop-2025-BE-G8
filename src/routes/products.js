import express from "express";
import { Product, Category } from "../models/Product.js";
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
    // Listar ut alla produkter och hämtar ut category name istället för objectID
    const products = await Product.find().populate("category", "name"); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});
//här är en funktion för en update(put). req.body samlar värdet och {new: true} skriver sedan ut det nya värdet.
router.put("/:id", async (req, res) => {
  try {

    const body = req.body
    // Kolla om kategorier med detta namn redan finns
    if (body.category) {
      let categoryName = await Category.findOne({name: body.category})

      if (!categoryName) {
        categoryName = await Category.create({ name: body.category})
      }

      body.category = categoryName._id;
    };

    const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true })
    if (!product) {
      throw new Error("Couldn't find product to update");
    }
    res.status(200).json(Product);
  } catch (error) {
    res.status(404).json({ error: "Error updating product" })
  }
});


//TODO Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
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
    // Test for categorySchema and its functionality -------
    const body = req.body

    // Checking if a category already exists in schema
    let categoryName = await Category.findOne({name: body.category})

    if (!categoryName) {
      categoryName = await Category.create({name: body.category})
    }

    //making string to objectID
    body.category = categoryName._id;
    // End of test for categorySchema ---------


    const product = new Product(body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//TODO Update product (admin only)

//TODO Delete product (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      throw new Error("Couldn't find product to delete");
    }
    res.status(204).json(product);
  } catch (error) {
    res.status(404).json({ error: "Error deleting product" })
  }
})

router.delete("/", async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} products` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting all products" });
  }
});

// ------ CategorySchema functions for frontend POST,GET,PUT,DELETE-------
//         LÄGG TILL ADMINAUTH!!!!
router.post("/categories",async (req,res) => {
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
router.get("/categories", async ( req, res) => {
  try { 
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories"});
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ errror: "Failed to fetch category"});
  }
});

// delete funktion för kategorier, LÄGG TILL ADMINAUTH
router.delete("/categories", async (req,res) => {
  try {
    const categories = await Category.deleteMany({});
    res.status(200).json({message: `${categories.deletedCount} categories deleted`});
  } catch (error) {
    res.status(500).json({error: "Failed to delete categories"});
  }
});

// delete funktion för kategorier:ID    LÄGG TILL ADMINAUTH
router.delete("categories/:id", async (req,res) => {
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
router.put("/categories/:id", async (req,res) => {
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
