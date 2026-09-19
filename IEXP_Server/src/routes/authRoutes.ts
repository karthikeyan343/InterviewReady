import { Router } from "express";

import {
  registerUser,
  loginUser,
  googleLoginUser,
  getCurrentUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLoginUser);

router.get("/me", protect, getCurrentUser);

export default router;