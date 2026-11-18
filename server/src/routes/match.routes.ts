
import { Router } from "express";
import { getDatabase } from "../services/database.service.js";

const router = Router();

const DEMO_USER_ID = "demo-user";

router.get("/", (_req, res) => {
  try {
    const database = getDatabase();

    const matches = database.matches
      .filter(
        (match) =>
          match.userOneId === DEMO_USER_ID ||
          match.userTwoId === DEMO_USER_ID
      )
      .map((match) => {
        const matchedUserId =
          match.userOneId === DEMO_USER_ID
            ? match.userTwoId
            : match.userOneId;

        const profile = database.profiles.find(
          (item) => item.id === matchedUserId
        );

        if (!profile) {
          return null;
        }

        return {
          id: match.id,
          createdAt: match.createdAt,
          profile
        };
      })
      .filter((match) => match !== null);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error("Matches error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load matches."
    });
  }
});

export default router;
