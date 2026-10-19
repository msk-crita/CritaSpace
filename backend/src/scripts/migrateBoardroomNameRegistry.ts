import "dotenv/config";
import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

function normalizeBoardroomName(name: string): string {
  return name.trim().toLowerCase();
}

async function migrateBoardroomNameRegistry(): Promise<void> {
  const snapshot = await db.collection("boardrooms").get();

  const names = new Map<string, string>();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (typeof data.name !== "string" || !data.name.trim()) {
      throw new Error(
        `Boardroom ${doc.id} has an invalid name. Fix it before migrating.`,
      );
    }

    const normalizedName = normalizeBoardroomName(data.name);
    const existingId = names.get(normalizedName);

    if (existingId) {
      throw new Error(
        `Duplicate boardroom names detected: ${existingId} and ${doc.id}. Resolve them before migrating.`,
      );
    }

    names.set(normalizedName, doc.id);
  }

  const registry = db.collection("boardroomNameRegistry");

  for (const [normalizedName, boardroomId] of names) {
    const registryRef = registry.doc(encodeURIComponent(normalizedName));

    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(registryRef);

      if (existing.exists) {
        const existingBoardroomId = existing.data()?.boardroomId;

        if (existingBoardroomId !== boardroomId) {
          throw new Error(
            `Registry conflict for "${normalizedName}". No records were overwritten.`,
          );
        }

        return;
      }

      transaction.create(registryRef, {
        normalizedName,
        boardroomId,
        createdAt: FieldValue.serverTimestamp(),
      });
    });
  }

  console.log(
    `Registry migration complete. Verified ${names.size} existing boardroom(s).`,
  );
}

migrateBoardroomNameRegistry().catch((error: unknown) => {
  console.error("Boardroom registry migration failed:", error);
  process.exitCode = 1;
});
