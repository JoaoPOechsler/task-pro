"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resendVerificationEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function loadUserProfile(firebaseUser: User) {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setUserProfile(snap.data() as UserProfile);
    }
  }

  async function saveUserProfile(firebaseUser: User, name: string) {
    const profile: UserProfile = {
      uid: firebaseUser.uid,
      name,
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? null,
      createdAt: new Date(),
      emailVerified: firebaseUser.emailVerified,
    };
    await setDoc(doc(db, "users", firebaseUser.uid), profile, { merge: true });
    setUserProfile(profile);
  }

  function setSessionCookie() {
    document.cookie = "session=1; path=/; SameSite=Strict";
  }

  function clearSessionCookie() {
    document.cookie = "session=; path=/; max-age=0; SameSite=Strict";
  }

  async function signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (!result.user.emailVerified) {
      await signOut(auth);
      throw new Error("Por favor, verifique seu e-mail antes de fazer login. Cheque sua caixa de entrada.");
    }
    setSessionCookie();
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(result.user, result.user.displayName ?? "Usuário");
    setSessionCookie();
  }

  async function signInWithGithub() {
    const result = await signInWithPopup(auth, githubProvider);
    await saveUserProfile(result.user, result.user.displayName ?? "Usuário");
    setSessionCookie();
  }

  async function registerWithEmail(name: string, email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
    await saveUserProfile(result.user, name);
    await signOut(auth);
  }

  async function resendVerificationEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user.emailVerified) {
      await signOut(auth);
      throw new Error("Este e-mail já foi verificado. Faça login normalmente.");
    }
    await sendEmailVerification(result.user);
    await signOut(auth);
  }

  async function logout() {
    await signOut(auth);
    clearSessionCookie();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithEmail,
        signInWithGoogle,
        signInWithGithub,
        registerWithEmail,
        resendVerificationEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
