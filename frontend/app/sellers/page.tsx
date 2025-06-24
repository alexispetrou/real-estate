"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

interface Seller {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt?: Timestamp;
}

export default function Sellers() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const adminRole = userData.role === "admin";
          setIsAdmin(adminRole);

          if (adminRole) {
            await fetchSellers();
          } else {
            console.warn("User is not admin. Access denied.");
          }
        } else {
          console.warn("User document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error checking user role in Firestore:", error);
      }
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const fetchSellers = async () => {
    try {
      console.log("Starting to fetch sellers...");
      setLoading(true);

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "seller"));
      const querySnapshot = await getDocs(q);

      const sellersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Seller[];

      setSellers(sellersData);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && !isAdmin) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You don&apos;t have permission to view this page. Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sellers Management</h1>
        <div className="text-sm text-gray-600">
          Total Sellers: {sellers.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading sellers...</p>
        </div>
      ) : sellers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center">No sellers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4">
                  <FaUser />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {seller.name || "Unnamed Seller"}
                  </h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded capitalize">
                    {seller.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  <span>{seller.email}</span>
                </div>

                {seller.createdAt && (
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>
                      Joined:{" "}
                      {new Date(
                        seller.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                  View Properties
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
