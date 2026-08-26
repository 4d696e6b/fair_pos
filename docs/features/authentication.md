# Authentication

The auth feature signs people in with **Firebase Authentication** (email and password) and keeps a matching profile in **Cloud Firestore**. Passwords never leave Firebase Auth — they are not stored on the `User` type or in Firestore.

This document is the how-to for `src/features/auth`. Routes stay thin; pages import from `@/features/auth` and do not talk to Firebase themselves.

---

## 1. Where the code lives

```
src/features/auth/
├── index.ts              Public API — import from here
├── types/auth.ts         Input shapes for the functions
├── hooks/use-auth.ts     Session hook for client components
└── services/
    ├── auth.ts           Register, login, password, email, account
    ├── users.ts          Firestore `users/{uid}` reads and writes
    └── errors.ts         AuthError + Firebase error mapping

src/types/user.ts         Shared profile model
src/lib/firebase.ts       Shared Auth + Firestore clients
src/app/(auth)/           URLs: login, register, forgot-password, verify-email, profile
```

Import direction:

```
src/app/(auth)  →  src/features/auth  →  src/lib/firebase, src/types/user
```

Other features must not import `@/features/auth`. If they need the signed-in user, promote a shared hook or type out of the feature (see `docs/architecture/folder-structure.md`).

All auth modules are **client-only** (`"use client"`). Call them from client components, not from Server Components or Route Handlers.

---

## 2. Data model

`src/types/user.ts`:

| Field | Type | Source |
| --- | --- | --- |
| `id` | `string` | Firebase Auth UID (also the Firestore document id) |
| `username` | `string` | Firestore + Auth `displayName` |
| `email` | `string` | Firestore + Auth email |
| `isVerified` | `boolean` | Synced from `firebaseUser.emailVerified` |
| `createdAt` / `updatedAt` | `Date` | Firestore timestamps, converted on read |

Firestore document: `users/{uid}`

```
{
  username: string
  email: string
  isVerified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Firebase Auth holds the password, session, and email-verification state. Firestore holds the app profile. `id` is the document id, not a field inside the document.

---

## 3. Firebase setup

1. Enable **Email/Password** under Authentication → Sign-in method.
2. Fill the `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` (see `.env.example`). Missing vars throw when `src/lib/firebase.ts` loads.
3. Point email action links at this app so `/verify-email` and `/forgot-password` can read `oobCode`:

   Authentication → Templates → customise action URL, for example:

   `http://localhost:3000/verify-email` in development  
   `https://<your-domain>/verify-email` in production

   Firebase appends query params: `mode`, `oobCode`, `apiKey`, `continueUrl`.

4. Firestore rules must let a signed-in user read and write **only** their own `users/{uid}` document. Example:

```
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 4. How to import

Always import from the feature barrel:

```ts
import {
  AuthError,
  login,
  logout,
  register,
  useAuth,
} from "@/features/auth";
```

A page should only compose UI:

```tsx
// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return <LoginForm />;
}
```

The form (a client component) calls `login`, catches `AuthError`, and shows `error.message`.

---

## 5. Session in the UI — `useAuth`

Use this in any client component that needs the current person:

```tsx
"use client";

import { useAuth } from "@/features/auth";

export function AccountMenu() {
  const { user, firebaseUser, loading } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!user) return <a href="/login">Sign in</a>;

  return (
    <p>
      {user.username}
      {user.isVerified ? "" : " (email not verified)"}
    </p>
  );
}
```

| Field | Meaning |
| --- | --- |
| `loading` | `true` until the first Auth state event (and profile fetch) finishes |
| `firebaseUser` | Firebase Auth user, or `null` if signed out |
| `user` | Firestore profile, or `null` if signed out or the profile document is missing |

`user.isVerified` is taken from `firebaseUser.emailVerified` so the UI matches Auth, not a stale Firestore flag.

Helpers if you are not in React:

- `getCurrentFirebaseUser()` — current Auth user, or `null`
- `getCurrentUser()` — Firestore profile, or `null`
- `refreshCurrentUser()` — `reload()` Auth, then re-read the profile (use after the user returns from a verification link)
- `observeAuthState(callback)` — subscribe; returns an unsubscribe function. `useAuth` already does this.

---

## 6. Functions

Every function below throws `AuthError` on failure. Catch it and show `error.message`. Sensitive actions (`changePassword`, `changeEmail`, `deleteAccount`) reauthenticate with the current password first.

### Register

Creates the Auth user, sets `displayName`, sends a verification email, then writes `users/{uid}`. If the Firestore write fails, the Auth user is deleted so you do not leave an orphan account.

```ts
const user = await register({
  username: "zen",
  email: "zen@example.com",
  password: "secret-password",
});
```

Empty username throws `auth/missing-username`. Duplicate email throws `auth/email-already-in-use`.

### Login / logout

```ts
const user = await login({
  email: "zen@example.com",
  password: "secret-password",
});

await logout();
```

`login` loads the Firestore profile. If the profile is missing it throws `auth/profile-not-found`. If Auth says the email is verified but Firestore does not, the profile flag is updated.

### Email verification

After register, the user is signed in but `isVerified` is `false` until they open the email link.

```ts
// Resend (must be signed in)
await sendVerificationEmail();

// On /verify-email?oobCode=...
const oobCode = new URLSearchParams(window.location.search).get("oobCode");
if (oobCode) {
  await completeEmailVerification(oobCode);
  await refreshCurrentUser();
}
```

`completeEmailVerification` applies the action code. If someone is signed in, it reloads Auth and writes `isVerified: true` to Firestore. If they opened the link while signed out, Auth is still updated; the next `login` / `refreshCurrentUser` syncs Firestore.

### Password reset

```ts
// On /forgot-password — send the email
await sendPasswordReset("zen@example.com");

// When they land back with ?mode=resetPassword&oobCode=...
const oobCode = new URLSearchParams(window.location.search).get("oobCode");
if (oobCode) {
  const email = await getPasswordResetEmail(oobCode); // confirm the account
  await completePasswordReset(oobCode, "new-secret-password");
}
```

`getPasswordResetEmail` validates the code and returns the email it was sent to (useful on the form). Expired or reused codes throw `auth/expired-action-code` or `auth/invalid-action-code`.

### Profile and account

Must be signed in.

```ts
await updateUsername({ username: "new-name" });

await changePassword({
  currentPassword: "secret-password",
  newPassword: "even-more-secret",
});

await changeEmail({
  currentPassword: "secret-password",
  newEmail: "new@example.com",
});

await deleteAccount("secret-password");
```

`changeEmail` uses Firebase `verifyBeforeUpdateEmail`: the new address is not applied until the user confirms the email Firebase sends. `deleteAccount` removes `users/{uid}` then the Auth user.

### Firestore profile helpers

Used internally; export them if you need a one-off read/write:

| Function | Behaviour |
| --- | --- |
| `getUserProfile(userId)` | `User` or `null` |
| `createUserProfile(user)` | Writes timestamps with `serverTimestamp()` |
| `updateUserProfile(userId, patch)` | Partial `username` / `email` / `isVerified` |
| `deleteUserProfile(userId)` | Deletes the document |

Prefer the Auth functions above so Auth and Firestore stay in sync.

---

## 7. Errors

```ts
import { AuthError, login } from "@/features/auth";

try {
  await login({ email, password });
} catch (error) {
  const message =
    error instanceof AuthError ? error.message : "Something went wrong.";
  setError(message);
}
```

`AuthError` has:

- `message` — safe to show in the UI
- `code` — Firebase code, or a feature code (`auth/unauthenticated`, `auth/profile-not-found`, `auth/missing-username`, `auth/missing-email`, `unknown`)

Mapped Firebase codes include: `auth/email-already-in-use`, `auth/invalid-email`, `auth/weak-password` (min 6 characters), `auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password`, `auth/user-disabled`, `auth/too-many-requests`, `auth/network-request-failed`, `auth/requires-recent-login`, `auth/expired-action-code`, `auth/invalid-action-code`, `auth/missing-password`, `auth/operation-not-allowed`.

Unknown codes become `"Something went wrong. Please try again."`

---

## 8. Wiring the existing routes

| URL | Intended functions |
| --- | --- |
| `/register` | `register` |
| `/login` | `login` |
| `/forgot-password` | `sendPasswordReset`; if `oobCode` is present, `getPasswordResetEmail` + `completePasswordReset` |
| `/verify-email` | `completeEmailVerification(oobCode)` and/or `sendVerificationEmail` |
| `/profile` | `useAuth`, `updateUsername`, `changePassword`, `changeEmail`, `logout`, `deleteAccount` |

Read `mode` and `oobCode` from `searchParams` (or `window.location.search`) on the verify and reset pages. Typical values: `mode=verifyEmail`, `mode=resetPassword`.

Until those forms exist, the functions are ready to call from any client component under `src/features/auth/components/`.
