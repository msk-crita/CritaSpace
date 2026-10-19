import type { NextFunction, Request, Response } from "express";
import { auth, db } from "../config/firebase.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    displayName: string;
    companyId: string;
    role: "admin" | "user";
    status: "active" | "disabled";
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
    });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "A valid authentication token is required.",
      },
    });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      res.status(403).json({
        success: false,
        error: {
          code: "USER_NOT_REGISTERED",
          message: "Your CritaSpace user account has not been registered.",
        },
      });
      return;
    }

    const userData = userDoc.data();

    if (
      typeof userData?.companyId !== "string" ||
      !userData.companyId.trim() ||
      !["admin", "user"].includes(userData.role as string) ||
      userData.status !== "active"
    ) {
      res.status(403).json({
        success: false,
        error: {
          code: "INVALID_USER_RECORD",
          message: "Your CritaSpace user record is invalid or inactive.",
        },
      });
      return;
    }

    if (userData?.status !== "active") {
      res.status(403).json({
        success: false,
        error: {
          code: "ACCOUNT_DISABLED",
          message: "Your CritaSpace account is not active.",
        },
      });
      return;
    }

    req.user = {
      uid: decodedToken.uid,
      ...(decodedToken.email ? { email: decodedToken.email } : {}),
      displayName: userData!.displayName,
      companyId: userData!.companyId,
      role: userData!.role,
      status: userData!.status,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "The authentication token is invalid or expired.",
      },
    });
  }
}
