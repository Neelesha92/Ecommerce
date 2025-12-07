import express from "express";
import prisma from "../prismaClient";
import { authenticate } from "../middleware/auth";
import { Request } from "express";
import { User } from "@prisma/client";

interface AuthRequest extends Request {
  user?: User;
}

const router = express.Router();

// Create a new order
router.post("/", authenticate, async (req: Request, res) => {
  try {
    const authReq = req as Request & { user?: User };
    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = authReq.user.id;
    const { items, total } = authReq.body;

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

// Get all orders for logged-in user
router.get("/", authenticate, async (req: Request, res) => {
  try {
    const authReq = req as Request & { user?: User };
    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = authReq.user.id;

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

router.get("/admin/all", authenticate, async (req, res) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  const { status, search, sort } = req.query;

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: String(status) } : {}),
      ...(search
        ? {
            OR: [
              { id: !isNaN(Number(search)) ? Number(search) : undefined },
              {
                user: {
                  name: { contains: String(search), mode: "insensitive" },
                },
              },
            ].filter(Boolean) as any,
          }
        : {}),
    },
    include: {
      orderItems: true,
      user: true,
    },
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" }, // default newest first
  });

  res.json(orders);
});

// Get a single order details
router.get("/:id", authenticate, async (req: Request, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { orderItems: true, user: true },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/status/:id", authenticate, async (req, res) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { status } = req.body;

  const updated = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status },
  });

  res.json({ message: "Order status updated", updated });
});

export default router;
