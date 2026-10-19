import "dotenv/config";
import { FieldValue } from "firebase-admin/firestore";
import { auth, db } from "../config/firebase.js";

async function bootstrapAdmin(): Promise<void> {
  const uid = process.env.BOOTSTRAP_ADMIN_UID?.trim();

  if (!uid || uid === "paste-your-firebase-user-uid-here") {
    throw new Error("Set BOOTSTRAP_ADMIN_UID in your local .env file.");
  }

  // Verify that the Firebase Authentication account exists.
  const firebaseUser = await auth.getUser(uid);

  if (!firebaseUser.email) {
    throw new Error(
      "The administrator's Firebase account must have an email address.",
    );
  }

  const companyId = "crita-creative";
  const companyRef = db.collection("companies").doc(companyId);
  const userRef = db.collection("users").doc(uid);

  // Never overwrite an existing user record.
  const existingUser = await userRef.get();

  if (existingUser.exists) {
    throw new Error(
      "A CritaSpace user record already exists for this UID. No changes made.",
    );
  }

  // Create the company only if it doesn't already exist.
  const existingCompany = await companyRef.get();

  if (!existingCompany.exists) {
    await companyRef.create({
      id: companyId,
      name: "Crita Creative",
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    const company = existingCompany.data();

    if (company?.name !== "Crita Creative" || company?.status !== "active") {
      throw new Error(
        "The existing company record does not match the expected active company.",
      );
    }
  }

  // Create the first administrator record.
  await userRef.create({
    uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName?.trim() || firebaseUser.email,
    companyId,
    role: "admin",
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log("CritaSpace administrator registered successfully.");
}

bootstrapAdmin().catch((error: unknown) => {
  console.error(
    "Administrator bootstrap failed:",
    error instanceof Error ? error.message : "Unexpected error.",
  );
  process.exitCode = 1;
});
