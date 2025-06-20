"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config"; // Εισαγωγή του db
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Νέες εισαγωγές Firestore

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]); // Το state θα περιέχει πλέον και το isLikedByUser
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const searchParams = useSearchParams();

  // useEffect για τον έλεγχο κατάστασης σύνδεσης
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      // Το fetchProperties θα κληθεί ξανά λόγω του isLoggedIn dependency
    });
    return () => unsubscribe();
  }, []);

  // Συνάρτηση για να εμπλουτίσει τα ακίνητα με την κατάσταση "liked" από το Firestore
  const enrichPropertiesWithLikedStatus = async (propsData) => {
    if (!auth.currentUser) {
      // Αν δεν υπάρχει συνδεδεμένος χρήστης, όλα είναι unliked
      return propsData.map(p => ({ ...p, isLikedByUser: false }));
    }

    const userUid = auth.currentUser.uid;
    const enrichedProps = [];

    for (const property of propsData) {
      let isLikedByUser = false;
      try {
        // Παίρνουμε το έγγραφο του ακινήτου από το Firestore για να δούμε το πεδίο 'liked'
        const propertyDocRef = doc(db, "properties", property.id); // Υποθέτουμε ότι το property.id από το API είναι το ίδιο με το Firestore Doc ID
        const propertyDocSnap = await getDoc(propertyDocRef);

        if (propertyDocSnap.exists()) {
          const firebasePropertyData = propertyDocSnap.data();
          // Ελέγχουμε αν το πεδίο 'liked' υπάρχει και είναι array, και αν περιέχει το UID του χρήστη
          if (firebasePropertyData.liked && Array.isArray(firebasePropertyData.liked)) {
            isLikedByUser = firebasePropertyData.liked.includes(userUid);
          }
        }
      } catch (error) {
        console.error("Error fetching liked status for property", property.id, error);
        // Αν υπάρξει σφάλμα, θεωρούμε ότι δεν είναι liked
        isLikedByUser = false;
      }
      enrichedProps.push({ ...property, isLikedByUser });
    }
    return enrichedProps;
  };


  // useEffect για τη φόρτωση των ακινήτων και την ενημέρωση της κατάστασης "liked"
  useEffect(() => {
    const fetchAndSetProperties = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const endpoint = query
          ? `http://localhost:8080/api/properties/search?${query}`
          : `http://localhost:8080/api/properties`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        let data = await res.json(); // Ακίνητα από το δικό σου API

        // Εμπλούτισε τα ακίνητα με την κατάσταση "liked" από το Firebase
        data = await enrichPropertiesWithLikedStatus(data);

        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetProperties();
  }, [searchParams, isLoggedIn]); // Προσθέτουμε το isLoggedIn ως dependency για να ξαναφορτώνει όταν ο χρήστης συνδέεται/αποσυνδέεται


  const handleFavorite = async (propertyId) => { // Έγινε async
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
      const propertyRef = doc(db, "properties", propertyId);

      // Βρες το ακίνητο στο τρέχον local state
      const currentPropertyIndex = properties.findIndex(p => p.id === propertyId);
      if (currentPropertyIndex === -1) {
        console.error("Property not found in local state:", propertyId);
        return;
      }

      const currentProperty = properties[currentPropertyIndex];
      const isCurrentlyLiked = currentProperty.isLikedByUser;

      try {
        if (isCurrentlyLiked) {
          // Αφαίρεση του UID του χρήστη από τον πίνακα 'liked' στο Firestore
          await updateDoc(propertyRef, {
            liked: arrayRemove(userUid),
          });
        } else {
          // Προσθήκη του UID του χρήστη στον πίνακα 'liked' στο Firestore
          await updateDoc(propertyRef, {
            liked: arrayUnion(userUid),
          });
        }

        // Ενημέρωσε το local state αμέσως για άμεση απόκριση στην UI
        setProperties(prevProperties => {
          const newProperties = [...prevProperties];
          newProperties[currentPropertyIndex] = {
            ...currentProperty,
            isLikedByUser: !isCurrentlyLiked, // Αντιστροφή της κατάστασης liked
          };
          return newProperties;
        });

      } catch (error) {
        console.error("Error updating favorite status:", error);
        alert("Error updating favorite status. Please try again.");
      }
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error loading properties: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">Σύνδεση Απαιτείται</h2>
            <p className="mb-6">
              Για να προσθέσετε ακίνητα στα αγαπημένα σας, πρέπει πρώτα να συνδεθείτε.
            </p>
            <button
              onClick={closeLoginPrompt}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
            >
              ΟΚ
            </button>
            <Link href="/authentication" passHref>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                Σύνδεση / Εγγραφή
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="relative border rounded-lg overflow-hidden shadow-lg"
            >
              {/* Κουμπί καρδιάς */}
              <button
                onClick={() => handleFavorite(property.id)}
                className="absolute top-2 right-2 z-10 text-2xl text-red-500 hover:scale-110 transition"
              >
                {/* Χρησιμοποιούμε το νέο πεδίο `isLikedByUser` */}
                {property.isLikedByUser ? "❤️" : "🤍"}
              </button>

              <Link href={`/properties/${property.id}`}>
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder-image.jpg'} // Ensure there's an image
                  alt={property.title}
                  className="w-full h-55 object-cover"
                />
              </Link>
              <div className="p-2.5">
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <div className="text-blue-500 font-bold mb-2">
                  <p>
                    <strong>Αγορά:</strong>{" "}
                    {property.priceSale
                      ? property.priceSale.toLocaleString() + " €"
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Ενοικίαση:</strong>{" "}
                    {property.priceRent
                      ? property.priceRent.toLocaleString() + " €"
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{property.area || "N/A"}</span>
                  <span>{property.size ? `${property.size} m²` : "N/A"}</span>
                  <span>
                    {property.bedrooms ? `${property.bedrooms} beds` : "N/A"}
                  </span>
                  <span>
                    {property.bathrooms ? `${property.bathrooms} baths` : "N/A"}
                  </span>
                </div>
                <Link href={`/properties/${property.id}`} legacyBehavior>
                  <a className="mt-4 w-full block text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}