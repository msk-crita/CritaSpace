import type { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebase.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
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

    req.user = {
      uid: decodedToken.uid,
      ...(decodedToken.email ? { email: decodedToken.email } : {}),
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
