
import { Router } from "express";
import { getDatabase } from "../services/database.service.js";

const router = Router();

const DEMO_USER_ID = "demo-user";

router.get("/", (_req, res) => {
  try {
    const database = getDatabase();

    const alreadySwiped = new Set(
      database.swipes
        .filter((swipe) => swipe.swiperId === DEMO_USER_ID)
        .map((swipe) => swipe.targetId)
    );

    const feed = database.profiles.filter(
      (profile) =>
        !alreadySwiped.has(profile.id) &&
        profile.id !== DEMO_USER_ID
    );

    res.status(200).json({
      success: true,
      count: feed.length,
      profiles: feed
    });
  } catch (error) {
    console.error("Feed error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discovery feed."
    });
  }
});

export default router;
