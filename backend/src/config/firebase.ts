import "dotenv/config";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("FIREBASE_PROJECT_ID is not configured.");
}

const firebaseApp = initializeApp({
  credential: applicationDefault(),
  projectId,
});

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
