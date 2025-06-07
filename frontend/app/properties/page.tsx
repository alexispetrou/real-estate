// src/app/PropertiesPage.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <-- Προσθήκη αυτής της γραμμής
import { useSearchParams } from "next/navigation";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Προσθήκη state για λάθη
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const endpoint = query
          ? `http://localhost:8080/api/properties/search?${query}`
          : `http://localhost:8080/api/properties`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

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
