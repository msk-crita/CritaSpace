import { Router } from "express";
import { db } from "../config/firebase.js";
import { authenticate } from "../middleware/authenticate.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

router.get("/me", authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  res.status(200).json({
    success: true,
    data: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      companyId: user.companyId,
      role: user.role,
      status: user.status,
    },
    message: "User profile retrieved successfully.",
  });
});

export default router;
