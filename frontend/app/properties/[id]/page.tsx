"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase/config";
import ContactForm from "../../components/ContactForm";

const db = getFirestore(app);

interface PropertyDetails {
  id: string;
  images: string;
  title: string;
  price_sale: number;
  area: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({
            id: docSnap.id,
            ...docSnap.data(),
          } as PropertyDetails);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading)
    return (
      <div className="container mx-auto px-6 py-8">
        <p>Loading...</p>
      </div>
    );

  if (!property)
    return (
      <div className="container mx-auto px-6 py-8">
        <p>Property not found</p>
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Properties
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={property.images}
          alt={property.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
          <p className="text-3xl text-blue-600 font-bold mb-8">
            €{property.price_sale.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">
                {property.size}
              </div>
              <div className="text-sm text-gray-600 mt-2">Square Meters</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">
                {property.bedrooms}
              </div>
              <div className="text-sm text-gray-600 mt-2">Bedrooms</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">
                {property.bathrooms}
              </div>
              <div className="text-sm text-gray-600 mt-2">Bathrooms</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">
                {property.area}
              </div>
              <div className="text-sm text-gray-600 mt-2">Location</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsContactFormOpen(true)}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        propertyTitle={property.title}
      />
    </div>
  );
}
