import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import passport from "./config/passport";
import oauthRouter from "./routes/oauth";
import session from "express-session";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cart";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Add session middleware BEFORE passport.initialize()
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session()); // ✅ required for passport session support

// Routes
app.use("/auth", authRoutes);
app.use("/oauth", oauthRouter);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/user", userRoutes);
app.use("/orders", orderRoutes);
// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
