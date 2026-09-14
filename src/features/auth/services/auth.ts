"use client";

import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";
import type { User } from "@/types/user";

import type {
  ChangeEmailInput,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../types/auth";
import { AuthError, toAuthError } from "./errors";
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "./users";

function requireFirebaseUser(): FirebaseUser {
  const user = auth.currentUser;

  if (!user) {
    throw new AuthError("กรุณาเข้าสู่ระบบก่อน", "auth/unauthenticated");
  }

  return user;
}

async function syncVerifiedFlag(firebaseUser: FirebaseUser): Promise<void> {
  await updateUserProfile(firebaseUser.uid, {
    isVerified: firebaseUser.emailVerified,
  });
}

async function loadProfile(firebaseUser: FirebaseUser): Promise<User> {
  const profile = await getUserProfile(firebaseUser.uid);

  if (!profile) {
    throw new AuthError("ไม่พบข้อมูลโปรไฟล์ของบัญชีนี้", "auth/profile-not-found");
  }

  if (profile.isVerified !== firebaseUser.emailVerified) {
    await syncVerifiedFlag(firebaseUser);
    return { ...profile, isVerified: firebaseUser.emailVerified };
  }

  return profile;
}

async function ensureProfile(firebaseUser: FirebaseUser): Promise<User> {
  const profile = await getUserProfile(firebaseUser.uid);

  if (profile) {
    if (profile.isVerified !== firebaseUser.emailVerified) {
      await syncVerifiedFlag(firebaseUser);
      return { ...profile, isVerified: firebaseUser.emailVerified };
    }

    return profile;
  }

  const email = firebaseUser.email ?? "";
  const username =
    firebaseUser.displayName?.trim() ||
    email.split("@")[0] ||
    "user";

  return createUserProfile({
    id: firebaseUser.uid,
    username,
    email,
    isVerified: firebaseUser.emailVerified,
  });
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    return await loadProfile(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}

export function observeAuthState(
  onChange: (firebaseUser: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, onChange);
}

export async function register({ username, email, password }: RegisterInput): Promise<User> {
  let firebaseUser: FirebaseUser | null = null;

  try {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      throw new AuthError("กรุณากรอกชื่อผู้ใช้", "auth/missing-username");
    }

    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    firebaseUser = credential.user;

    await updateProfile(firebaseUser, { displayName: trimmedUsername });
    await sendEmailVerification(firebaseUser);

    return await createUserProfile({
      id: firebaseUser.uid,
      username: trimmedUsername,
      email: firebaseUser.email ?? email.trim(),
      isVerified: firebaseUser.emailVerified,
    });
  } catch (error) {
    if (firebaseUser) {
      await deleteUser(firebaseUser).catch(() => undefined);
    }

    throw toAuthError(error);
  }
}

export async function login({ email, password }: LoginInput): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return await ensureProfile(credential.user);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return await ensureProfile(credential.user);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function sendVerificationEmail(): Promise<void> {
  try {
    const firebaseUser = requireFirebaseUser();
    await sendEmailVerification(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function completeEmailVerification(oobCode: string): Promise<void> {
  try {
    await applyActionCode(auth, oobCode);

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return;
    }

    await reload(firebaseUser);
    await syncVerifiedFlag(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function refreshCurrentUser(): Promise<User | null> {
  try {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    await reload(firebaseUser);
    return await loadProfile(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function getPasswordResetEmail(oobCode: string): Promise<string> {
  try {
    return await verifyPasswordResetCode(auth, oobCode);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function completePasswordReset(oobCode: string, newPassword: string): Promise<void> {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function updateUsername({ username }: UpdateProfileInput): Promise<User> {
  try {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      throw new AuthError("กรุณากรอกชื่อผู้ใช้", "auth/missing-username");
    }

    const firebaseUser = requireFirebaseUser();
    await updateProfile(firebaseUser, { displayName: trimmedUsername });
    await updateUserProfile(firebaseUser.uid, { username: trimmedUsername });
    return await loadProfile(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}

async function reauthenticate(currentPassword: string): Promise<FirebaseUser> {
  const firebaseUser = requireFirebaseUser();
  const email = firebaseUser.email;

  if (!email) {
    throw new AuthError("บัญชีนี้ไม่มีอีเมลสำหรับยืนยันตัวตน", "auth/missing-email");
  }

  const credential = EmailAuthProvider.credential(email, currentPassword);
  await reauthenticateWithCredential(firebaseUser, credential);
  return firebaseUser;
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  try {
    const firebaseUser = await reauthenticate(currentPassword);
    await updatePassword(firebaseUser, newPassword);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function changeEmail({ currentPassword, newEmail }: ChangeEmailInput): Promise<void> {
  try {
    const firebaseUser = await reauthenticate(currentPassword);
    await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim());
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function deleteAccount(currentPassword: string): Promise<void> {
  try {
    const firebaseUser = await reauthenticate(currentPassword);
    const userId = firebaseUser.uid;

    await deleteUserProfile(userId);
    await deleteUser(firebaseUser);
  } catch (error) {
    throw toAuthError(error);
  }
}
