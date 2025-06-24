"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlus, FaBed, FaBath, FaTrash } from "react-icons/fa";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

interface Property {
  id: string;
  title: string;
  description: string;
  price_sale: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  propertyType: string;
  images: string[];
  userId: string;
  createdAt: Timestamp | null;
}

export default function MyProperties() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "house",
    imageUrls: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserProperties(currentUser.uid);
      } else {
        setProperties([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProperties = async (userId: string) => {
    try {
      setLoading(true);

      const propertiesRef = collection(db, "properties");
      const q = query(propertiesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userProperties = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Property)
      );

      setProperties(userProperties);
    } catch (error) {
      console.error("Error fetching user properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "properties", propertyId));
      console.log("Property deleted successfully");

      // Refresh the properties list
      await fetchUserProperties(user.uid);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User not authenticated");
      alert("Please log in to create a property listing");
      return;
    }

    console.log("Current user:", user.uid);
    console.log("Form data:", formData);

    try {
      setLoading(true);

      

      const imageUrls = formData.imageUrls;

      // Create property object for Firestore
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price_sale: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFeet: parseInt(formData.squareFeet),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        propertyType: formData.propertyType,
        images: imageUrls,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      console.log("Property data to save:", propertyData);

      const docRef = await addDoc(collection(db, "properties"), propertyData);
      console.log("Property created successfully with ID:", docRef.id);
      await fetchUserProperties(user.uid);

      // Reset form after property submission
      setFormData({
        title: "",
        description: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "house",
        images: [],
      });

      setShowCreateForm(false);
      alert("Property created successfully!");
    } catch (error) {
      console.error("Error creating property:", error);
      alert(
        "Error creating property. Please check your permissions and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>Create New Listing</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Property Listing
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beautiful family home..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your property..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Field</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Athens"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Attica"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs (from Spitogatos)
                </label>
                <textarea
                  name="imageUrls"
                  value={formData.imageUrls.join('\n')}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrls: e.target.value
                        .split('\n')
                        .map((url) => url.trim())
                        .filter((url) => url !== ""),
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste image URLs here, one per line..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Επικόλλησε τα URLs από το Spitogatos (μία ανά γραμμή)
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User's Properties List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Properties
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading your properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-600">
            No properties listed yet. Create your first listing!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {property.images && property.images.length > 0 && (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete property"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {property.price_sale.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaBed className="mr-1" /> {property.bedrooms} bed
                    </span>
                    <span className="flex items-center">
                      <FaBath className="mr-1" /> {property.bathrooms} bath
                    </span>
                    <span>{property.size} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
