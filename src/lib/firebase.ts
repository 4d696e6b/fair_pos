import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill in the Firebase web app config.`,
    );
  }

  return value;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  databaseURL: requireEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
};

// Next.js hot reload re-runs this module, so reuse the app instead of creating a second one.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** Email / password (and later roles) via Firebase Authentication. */
export const auth = getAuth(firebaseApp);

/** Document store — menus, orders, users, financial records. */
export const firestore = getFirestore(firebaseApp);

/** Live updates — kitchen tickets, open carts, presence. */
export const database = getDatabase(firebaseApp);

/** Files — menu photos, receipts, uploads. */
export const storage = getStorage(firebaseApp);
