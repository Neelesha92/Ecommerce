import express from "express";
import passport from "passport";

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect("http://localhost:5173/home");
  }
);

export default router;
