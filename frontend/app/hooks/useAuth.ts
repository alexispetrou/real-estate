import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export interface UserWithRole extends FirebaseUser {
  role?: "admin" | "seller" | "client";
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userWithRole = {
              ...currentUser,
              role: userData.role,
            } as UserWithRole;

            setUser(userWithRole);
            setUserRole(userData.role);
          } else {
            setUser(currentUser as UserWithRole);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(currentUser as UserWithRole);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userRole, loading };
};

export const hasRole = (
  userRole: string | null,
  allowedRoles: string[]
): boolean => {
  return userRole !== null && allowedRoles.includes(userRole);
};

export const isAdmin = (userRole: string | null): boolean => {
  return userRole === "admin";
};

export const isSeller = (userRole: string | null): boolean => {
  return userRole === "seller";
};

export const isClient = (userRole: string | null): boolean => {
  return userRole === "client";
};
