import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import prisma from "../prismaClient";

const router = Router();

// GET all categories
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });
  res.json(categories);
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
