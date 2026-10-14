import express from "express";
import "dotenv/config";
import { db } from "./config/firebase.js";

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CritaSpace backend is running",
  });
});

app.get("/api/health/firestore", async (_req, res, next) => {
  try {
    await db.listCollections();

    res.status(200).json({
      success: true,
      message: "Firestore connection successful.",
    });
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    _err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
      },
    });
  },
);

app.listen(PORT, () => {
  console.log(`CritaSpace backend running at http://localhost:${PORT}`);
});
