// src/app/PropertiesPage.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <-- Προσθήκη αυτής της γραμμής

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Προσθήκη state για λάθη

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Καλέστε το API endpoint του Java backend σας
        const response = await fetch("http://localhost:8080/api/properties"); // Αλλάξτε το port αν το Spring Boot τρέχει σε άλλο (το default είναι 8080)

        if (!response.ok) {
          // Αν η απάντηση δεν είναι 2xx (π.χ., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Μετατρέψτε την απάντηση σε JSON
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties from Java backend:", err);
        setError(err.message); // Αποθήκευση του μηνύματος λάθους
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error loading properties: {error}</p>; // Εμφάνιση λάθους

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              {/* Εδώ προσθέτουμε το Link component γύρω από την εικόνα */}
              <Link href={`/properties/${property.id}`}>
                <img
                  src={property.images}
                  alt={property.title}
                  className="w-full h-55 object-cover"
                />
              </Link>
              <div className="p-2.5">
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p className="text-blue-500 font-bold mb-2">
                  €{property.price_sale ? property.price_sale.toLocaleString() : 'N/A'}
                </p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{property.area || 'N/A'}</span>
                  <span>{property.size ? `${property.size} m²` : 'N/A'}</span>
                  <span>{property.bedrooms ? `${property.bedrooms} beds` : 'N/A'}</span>
                  <span>{property.bathrooms ? `${property.bathrooms} baths` : 'N/A'}</span>
                </div>
                {/* Εδώ προσθέτουμε το Link component γύρω από το κουμπί */}
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