"use client";

export { AuthError } from "./services/errors";
export {
  changeEmail,
  changePassword,
  completeEmailVerification,
  completePasswordReset,
  deleteAccount,
  getCurrentFirebaseUser,
  getCurrentUser,
  getPasswordResetEmail,
  login,
  loginWithGoogle,
  logout,
  observeAuthState,
  refreshCurrentUser,
  register,
  sendPasswordReset,
  sendVerificationEmail,
  updateUsername,
} from "./services/auth";
export {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "./services/users";
export { useAuth } from "./hooks/use-auth";
export type {
  ChangeEmailInput,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./types/auth";
