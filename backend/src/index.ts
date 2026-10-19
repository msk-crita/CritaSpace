import express from "express";
import "dotenv/config";
import { db } from "./config/firebase.js";
import authRoutes from "./routes/authRoutes.js";
import boardroomRoutes from "./routes/boardroomRoutes.js";

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boardrooms", boardroomRoutes);

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
    console.error("API error:", _err);
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
