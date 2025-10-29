import React, { createContext, useState, useEffect, useContext } from "react";
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { type Employee } from "../types/";
import { getUserById } from "../services/firebase";

interface AuthContextType {
  user: Employee | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userData = await getUserById(fbUser.uid);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const autoSignIn = async () => {
      if (!firebaseUser && !user) {
        // Only attempt auto-sign-in if no user is currently logged in
        setLoading(true);
        const { success, error } = await signIn("hr.manager", "hrpassword123");
        if (!success) {
          console.error("Auto sign-in failed:", error);
        }
        setLoading(false);
      }
    };

    autoSignIn();
  }, [firebaseUser, user]);

  const signIn = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const email = `${username}@chatapp.com`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = await getUserById(userCredential.user.uid);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);

      const firbaseError = error as { code: string };
      let errorMessage = "An error occurred during sign in";
      if (
        firbaseError.code === "auth/user-not-found" ||
        firbaseError.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid username or password";
      } else if (firbaseError.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (firbaseError.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
