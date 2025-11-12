import { Router } from "express";
import { register } from "../controllers/authController";
import { login } from "../controllers/authController";
import { forgotPassword } from "../controllers/authController";
import { resetPassword } from "../controllers/authController";
import passport from "passport";
const router = Router();

// POST /auth/register
router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

export default router;
