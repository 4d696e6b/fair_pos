"use client";

import { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";

import type { User } from "@/types/user";

import { getUserProfile } from "../services/users";
import { observeAuthState } from "../services/auth";

type AuthState = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      if (!firebaseUser) {
        setState({ firebaseUser: null, user: null, loading: false });
        return;
      }

      void getUserProfile(firebaseUser.uid)
        .then((user) => {
          setState({
            firebaseUser,
            user:
              user === null
                ? null
                : { ...user, isVerified: firebaseUser.emailVerified },
            loading: false,
          });
        })
        .catch(() => {
          setState({ firebaseUser, user: null, loading: false });
        });
    });

    return unsubscribe;
  }, []);

  return state;
}
