import express from "express";
import prisma from "../prismaClient";
import { authenticate } from "../middleware/auth";

const router = express.Router();
router.use(authenticate);

// -------- PROFILE --------
router.get("/profile", authenticate, async (req, res) => {
  const user = (req as any).user; // comes from JWT

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

router.put("/profile", async (req, res) => {
  const user = (req as any).user;
  const { name } = req.body;
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name },
    select: { id: true, name: true, email: true },
  });
  res.json(updated);
});

router.get("/profile/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  res.json(user);
});

// -------- ADDRESSES --------
router.get("/addresses", async (req, res) => {
  const user = (req as any).user;
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  res.json(addresses);
});

router.post("/addresses", async (req, res) => {
  const user = (req as any).user;
  const {
    label,
    recipient,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (!recipient || !line1 || !city || !country)
    return res.status(400).json({ message: "Missing required fields" });

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label,
      recipient,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    },
  });
  res.status(201).json(address);
});

router.put("/addresses/:id", async (req, res) => {
  const user = (req as any).user;
  const addrId = parseInt(req.params.id);
  const {
    label,
    recipient,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  const existing = await prisma.address.findUnique({ where: { id: addrId } });
  if (!existing || existing.userId !== user.id)
    return res.status(404).json({ message: "Address not found" });

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id: addrId },
    data: {
      label,
      recipient,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    },
  });
  res.json(updated);
});

router.delete("/addresses/:id", async (req, res) => {
  const user = (req as any).user;
  const addrId = parseInt(req.params.id);

  const existing = await prisma.address.findUnique({ where: { id: addrId } });
  if (!existing || existing.userId !== user.id)
    return res.status(404).json({ message: "Address not found" });

  await prisma.address.delete({ where: { id: addrId } });

  // set new default if deleted default
  if (existing.isDefault) {
    const another = await prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (another)
      await prisma.address.update({
        where: { id: another.id },
        data: { isDefault: true },
      });
  }

  res.json({ success: true });
});

router.patch("/addresses/:id/default", async (req, res) => {
  const user = (req as any).user;
  const addrId = parseInt(req.params.id);

  const existing = await prisma.address.findUnique({ where: { id: addrId } });
  if (!existing || existing.userId !== user.id)
    return res.status(404).json({ message: "Address not found" });

  await prisma.address.updateMany({
    where: { userId: user.id, isDefault: true },
    data: { isDefault: false },
  });

  const updated = await prisma.address.update({
    where: { id: addrId },
    data: { isDefault: true },
  });

  res.json(updated);
});

export default router;
