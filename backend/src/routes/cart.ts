import express from "express";
import prisma from "../prismaClient";

const router = express.Router();

// get user cart
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add to cart

router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    let cart = await prisma.cart.findFirst({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // check item is already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // update quantity instead
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return res.json(updated);
    }

    // add new item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// update quantity

router.put("/update", async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating quantity" });
  }
});

// remove item from cart

router.delete("/remove/:itemId", async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: "Error removing item" });
  }
});

// clear Cart

router.delete("/clear/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const cart = await prisma.cart.findFirst({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ error: "Cart already empty" });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({ message: "cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Error clearing cart" });
  }
});

export default router;
