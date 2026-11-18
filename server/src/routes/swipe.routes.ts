
import { Router } from "express";
import { z } from "zod";

import {
  getDatabase,
  updateDatabase
} from "../services/database.service.js";

import type { Match } from "../types.js";

const router = Router();

const DEMO_USER_ID = "demo-user";

const swipeSchema = z.object({
  profileId: z.string().min(1),
  action: z.enum(["like", "pass"])
});

router.post("/", async (req, res) => {
  try {
    const validation = swipeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid swipe data."
      });
    }

    const { profileId, action } = validation.data;

    const database = getDatabase();

    const profileExists = database.profiles.some(
      (profile) => profile.id === profileId
    );

    if (!profileExists || profileId === DEMO_USER_ID) {
      return res.status(404).json({
        success: false,
        message: "Profile not found."
      });
    }

    const alreadySwiped = database.swipes.some(
      (swipe) =>
        swipe.swiperId === DEMO_USER_ID &&
        swipe.targetId === profileId
    );

    if (alreadySwiped) {
      return res.status(409).json({
        success: false,
        message: "You have already swiped on this profile."
      });
    }

    const isMutualLike =
      action === "like" &&
      database.incomingLikes.includes(profileId);

    const existingMatch = database.matches.some(
      (match) =>
        (match.userOneId === DEMO_USER_ID &&
          match.userTwoId === profileId) ||
        (match.userOneId === profileId &&
          match.userTwoId === DEMO_USER_ID)
    );

    const matchToCreate: Match | null =
      isMutualLike && !existingMatch
        ? {
            id: `match-${Date.now()}`,
            userOneId: DEMO_USER_ID,
            userTwoId: profileId,
            createdAt: new Date().toISOString()
          }
        : null;

    await updateDatabase((currentDatabase) => {
      currentDatabase.swipes.push({
        swiperId: DEMO_USER_ID,
        targetId: profileId,
        action,
        createdAt: new Date().toISOString()
      });

      if (matchToCreate) {
        currentDatabase.matches.push(matchToCreate);
      }
    });

    const matchedProfile = matchToCreate
      ? getDatabase().profiles.find(
          (profile) => profile.id === profileId
        )
      : null;

    return res.status(200).json({
      success: true,
      action,
      matched: Boolean(matchToCreate),
      match: matchToCreate && matchedProfile
        ? {
            ...matchToCreate,
            profile: matchedProfile
          }
        : null,
      message: matchToCreate
        ? "It's a match!"
        : action === "like"
          ? "Like recorded."
          : "Profile passed."
    });
  } catch (error) {
    console.error("Swipe error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process swipe."
    });
  }
});

export default router;
