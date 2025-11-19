import express from "express";
import { authenticate, authorize } from "../middleware/auth";
import prisma from "../prismaClient";
import upload from "../utils/multer";
import cloudinary from "../utils/cloudinary";

const router = express.Router();

//Get all products (public) with pagination

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    //fetch paginated products
    const products = await prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });
    // count total products
    const totalProducts = await prisma.product.count();

    res.json({
      success: true,
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined;

    const priceMin = req.query.priceMin
      ? Number(req.query.priceMin)
      : undefined;
    const priceMax = req.query.priceMax
      ? Number(req.query.priceMax)
      : undefined;
    const search = req.query.q ? String(req.query.q) : undefined;
    const sort = req.query.sort ? String(req.query.sort) : undefined;

    // build prisma filter object
    const where: any = {};
    if (categoryId !== undefined) where.categoryId = categoryId;
    if (priceMin != null || priceMax != null) {
      // null or undefined
      where.price = {};
      if (priceMin != null) where.price.gte = priceMin;
      if (priceMax != null) where.price.lte = priceMax;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    let orderBy: any = { id: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };
    else if (sort === "oldest") orderBy = { createdAt: "asc" };

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { category: true },
    });

    const totalProducts = await prisma.product.count({ where });

    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// get single product (admin only)

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "product not found!" });
    }

    // fetch related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id }, //exclude the current product
      },
      take: 4, // limit number of related products
    });
    res.json({ product, relatedProducts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

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
