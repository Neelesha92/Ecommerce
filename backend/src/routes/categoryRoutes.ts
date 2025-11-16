import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import prisma from "../prismaClient";
import { setHeapSnapshotNearHeapLimit } from "v8";
import { channel } from "diagnostics_channel";

const router = Router();

// GET all categories
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });
  res.json(categories);
});

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

// POST create category (Admin only)
router.post("/", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await prisma.category.create({
      data: { name, description },
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
});

// PUT update category (Admin only)
router.put("/:id", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error updating category" });
  }
});

// DELETE category (Admin only)
router.delete("/:id", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

export default router;
