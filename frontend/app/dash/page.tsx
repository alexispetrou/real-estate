"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User } from "../types/types";
import { auth } from "../firebase/config";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged inz
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // No user is signed in, redirect to login
        router.push("/authentication");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push("/authentication");
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">My Properties</h2>
            <p>View and manage your saved properties.</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
            <p>Update your profile and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
