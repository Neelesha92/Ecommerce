import express from "express";
import prisma from "../prismaClient";
import { authenticate } from "../middleware/auth"; // JWT auth
import { Request } from "express";

// Extend Request type locally
interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
    name?: string;
  };
}

const router = express.Router();

// Create a new order
router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.params.userId);
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user orders
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
