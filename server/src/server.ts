
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./services/database.service.js";

import feedRoutes from "./routes/feed.routes.js";
import swipeRoutes from "./routes/swipe.routes.js";
import matchRoutes from "./routes/match.routes.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Coy Discover API is running."
  });
});

app.use("/api/feed", feedRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/matches", matchRoutes);

async function startServer(): Promise<void> {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log("----------------------------------");
      console.log("COY DISCOVER API");
      console.log("----------------------------------");
      console.log(`Server running: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Feed: http://localhost:${PORT}/api/feed`);
      console.log(`Matches: http://localhost:${PORT}/api/matches`);
      console.log("----------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
