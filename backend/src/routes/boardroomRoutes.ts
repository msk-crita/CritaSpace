import { Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const BOARDROOMS = "boardrooms";
const NAME_REGISTRY = "boardroomNameRegistry";
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

function normalizeBoardroomName(name: string): string {
  return name.trim().toLowerCase();
}

function getNameRegistryRef(name: string) {
  return db
    .collection(NAME_REGISTRY)
    .doc(encodeURIComponent(normalizeBoardroomName(name)));
}

function isValidFacilities(facilities: unknown): facilities is string[] {
  return (
    Array.isArray(facilities) &&
    facilities.every(
      (facility: unknown) =>
        typeof facility === "string" && facility.trim().length > 0,
    )
  );
}

// GET /api/boardrooms
// Retrieve active boardrooms.
router.get("/", authenticate, async (_req, res, next) => {
  try {
    const snapshot = await db
      .collection(BOARDROOMS)
      .where("status", "==", "active")
      .orderBy("name")
      .get();

    const boardrooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: boardrooms,
      message: "Boardrooms retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/boardrooms
// Create a boardroom. Admin only.
router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, capacity, facilities } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > MAX_NAME_LENGTH ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > MAX_DESCRIPTION_LENGTH ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      !isValidFacilities(facilities)
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_BOARDROOM_DATA",
          message:
            "Provide a name (maximum 100 characters), description (maximum 1000 characters), positive integer capacity, and an array of non-empty facilities.",
        },
      });
      return;
    }

    const trimmedName = name.trim();
    const normalizedName = normalizeBoardroomName(trimmedName);
    const nameRef = getNameRegistryRef(trimmedName);
    const boardroomRef = db.collection(BOARDROOMS).doc();

    await db.runTransaction(async (transaction) => {
      const nameDoc = await transaction.get(nameRef);

      if (nameDoc.exists) {
        throw new Error("BOARDROOM_ALREADY_EXISTS");
      }

      transaction.create(nameRef, {
        normalizedName,
        boardroomId: boardroomRef.id,
        createdAt: FieldValue.serverTimestamp(),
      });

      transaction.create(boardroomRef, {
        name: trimmedName,
        description: description.trim(),
        capacity,
        facilities: facilities.map((facility) => facility.trim()),
        status: "active",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    res.status(201).json({
      success: true,
      data: { id: boardroomRef.id },
      message: "Boardroom created successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "BOARDROOM_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        error: {
          code: "BOARDROOM_ALREADY_EXISTS",
          message: "A boardroom with this name already exists.",
        },
      });
      return;
    }

    next(error);
  }
});

// PATCH /api/boardrooms/:id
// Update a boardroom. Admin only.
router.patch("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, capacity, facilities, status } = req.body;
    const updates: Record<string, unknown> = {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > MAX_NAME_LENGTH
      ) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_BOARDROOM_NAME",
            message:
              "Boardroom name must not be empty or exceed 100 characters.",
          },
        });
        return;
      }

      updates.name = name.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim() ||
        description.trim().length > MAX_DESCRIPTION_LENGTH
      ) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_BOARDROOM_DESCRIPTION",
            message:
              "Boardroom description must not be empty or exceed 1000 characters.",
          },
        });
        return;
      }

      updates.description = description.trim();
    }

    if (capacity !== undefined) {
      if (!Number.isInteger(capacity) || capacity < 1) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_BOARDROOM_CAPACITY",
            message: "Capacity must be a positive integer.",
          },
        });
        return;
      }

      updates.capacity = capacity;
    }

    if (facilities !== undefined) {
      if (!isValidFacilities(facilities)) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_BOARDROOM_FACILITIES",
            message: "Facilities must be an array of non-empty strings.",
          },
        });
        return;
      }

      updates.facilities = facilities.map((facility) => facility.trim());
    }

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_BOARDROOM_STATUS",
            message: "Status must be active or inactive.",
          },
        });
        return;
      }

      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "NO_UPDATES_PROVIDED",
          message: "Provide at least one valid field to update.",
        },
      });
      return;
    }

    const boardroomId = req.params.id;

    if (typeof boardroomId !== "string" || !boardroomId.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_BOARDROOM_ID",
          message: "A valid boardroom ID is required.",
        },
      });
      return;
    }

    const boardroomRef = db.collection(BOARDROOMS).doc(boardroomId);
    const registry = db.collection(NAME_REGISTRY);

    const result = await db.runTransaction(async (transaction) => {
      const boardroomDoc = await transaction.get(boardroomRef);

      if (!boardroomDoc.exists) {
        return { type: "not-found" as const };
      }

      const currentData = boardroomDoc.data()!;
      const currentName = currentData.name;

      if (typeof currentName !== "string" || !currentName.trim()) {
        return { type: "registry-conflict" as const };
      }

      const oldNormalizedName = normalizeBoardroomName(currentName);
      const newName =
        typeof updates.name === "string" ? updates.name : currentName;
      const newNormalizedName = normalizeBoardroomName(newName);

      const oldNameRef = registry.doc(encodeURIComponent(oldNormalizedName));
      const newNameRef = registry.doc(encodeURIComponent(newNormalizedName));

      // Complete all transaction reads before writing.
      const oldNameDoc = await transaction.get(oldNameRef);
      const newNameDoc =
        newNormalizedName === oldNormalizedName
          ? oldNameDoc
          : await transaction.get(newNameRef);

      if (
        newNormalizedName !== oldNormalizedName &&
        newNameDoc.exists &&
        newNameDoc.data()?.boardroomId !== boardroomId
      ) {
        return { type: "duplicate" as const };
      }

      if (oldNameDoc.exists && oldNameDoc.data()?.boardroomId !== boardroomId) {
        return { type: "registry-conflict" as const };
      }

      if (newNormalizedName !== oldNormalizedName) {
        // Reserve the new name before releasing the old one.
        transaction.set(newNameRef, {
          normalizedName: newNormalizedName,
          boardroomId,
          createdAt: FieldValue.serverTimestamp(),
        });

        if (oldNameDoc.exists) {
          transaction.delete(oldNameRef);
        }
      } else if (!oldNameDoc.exists) {
        // Reconcile a missing registry entry for an unchanged name.
        transaction.create(oldNameRef, {
          normalizedName: oldNormalizedName,
          boardroomId,
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      transaction.update(boardroomRef, {
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        type: "updated" as const,
        data: { id: boardroomId, ...currentData, ...updates },
      };
    });

    if (result.type === "not-found") {
      res.status(404).json({
        success: false,
        error: {
          code: "BOARDROOM_NOT_FOUND",
          message: "Boardroom not found.",
        },
      });
      return;
    }

    if (result.type === "duplicate") {
      res.status(409).json({
        success: false,
        error: {
          code: "BOARDROOM_ALREADY_EXISTS",
          message: "A boardroom with this name already exists.",
        },
      });
      return;
    }

    if (result.type === "registry-conflict") {
      res.status(409).json({
        success: false,
        error: {
          code: "BOARDROOM_REGISTRY_CONFLICT",
          message:
            "The boardroom name registry needs reconciliation. No changes were made.",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
      message: "Boardroom updated successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
