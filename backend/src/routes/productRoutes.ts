import express from "express";
import { authenticate, authorize } from "../middleware/auth";
import prisma from "../prismaClient";
import upload from "../utils/multer";
import cloudinary from "../utils/cloudinary";

const router = express.Router();

// Get all products (public)

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// get single product (admin only)

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: "product not found!" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// create a product(admin only)

// create a product (admin only)
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"), // handle image file
  async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || !description || !price || !stock || !req.file || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    try {
      // Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      // Create product in DB
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          image: uploaded.secure_url,
          categoryId: Number(categoryId),
        },
        include: {
          category: true,
        },
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating product" });
    }
  }
);

// update product (admin only)
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, stock, categoryId } = req.body;

    try {
      const data: any = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
      };

      // If new file uploaded → upload to cloudinary
      if (req.file) {
        const uploaded = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        data.image = uploaded.secure_url;
      }

      const product = await prisma.product.update({
        where: { id },
        data,
      });

      res.json(product);
    } catch (err: any) {
      console.error("Update product error:", err);
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  }
);

// Delete product (admin only)

router.delete("/:id", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;
