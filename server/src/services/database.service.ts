
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Database } from "../types.js";
import { seedProfiles } from "../data/seedProfiles.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const databaseDirectory = path.resolve(currentDirectory, "../../data");
const databaseFile = path.join(databaseDirectory, "database.json");

let database: Database | null = null;
let updateQueue: Promise<void> = Promise.resolve();

const initialDatabase: Database = {
  profiles: seedProfiles,
  swipes: [],
  matches: [],
  incomingLikes: ["p02", "p05", "p09", "p14", "p20", "p27"]
};

async function saveDatabase(data: Database): Promise<void> {
  await fs.mkdir(databaseDirectory, { recursive: true });

  const temporaryFile = `${databaseFile}.tmp`;

  await fs.writeFile(
    temporaryFile,
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  await fs.rename(temporaryFile, databaseFile);
}

export async function initializeDatabase(): Promise<void> {
  await fs.mkdir(databaseDirectory, { recursive: true });

  try {
    const fileContent = await fs.readFile(databaseFile, "utf-8");
    database = JSON.parse(fileContent) as Database;

    console.log("Existing JSON database loaded.");
  } catch {
    database = structuredClone(initialDatabase);

    await saveDatabase(database);

    console.log("New JSON database created with 30 profiles.");
  }
}

export function getDatabase(): Database {
  if (!database) {
    throw new Error(
      "Database is not initialized. Call initializeDatabase() first."
    );
  }

  return database;
}

export function updateDatabase(
  updater: (currentDatabase: Database) => void
): Promise<void> {
  const operation = updateQueue.then(async () => {
    const currentDatabase = getDatabase();
    const updatedDatabase = structuredClone(currentDatabase);

    updater(updatedDatabase);

    await saveDatabase(updatedDatabase);

    database = updatedDatabase;
  });

  updateQueue = operation.catch(() => undefined);

  return operation;
}
