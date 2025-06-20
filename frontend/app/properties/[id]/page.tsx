"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// Έχω διορθώσει τη διαδρομή εδώ. Αν δεν λειτουργεί,
// ίσως χρειαστεί να προσαρμόσεις τα "../" ανάλογα με τη δομή του project σου.
import { app } from "../../firebase/config"; // Διορθωμένη διαδρομή για το firebase/config
import ContactForm from "../../components/ContactForm";

const db = getFirestore(app);

// Ενημερωμένο interface: το 'images' είναι πλέον πίνακας από strings
interface PropertyDetails {
  id: string;
  images: string[]; // <-- **Αλλαγή εδώ**: είναι πίνακας από URLs εικόνων
  title: string;
  price_sale: number;
  area: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  // Πρόσθεσε κι εδώ όποια άλλα πεδία έχει το ακίνητό σου στο Firestore
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  // ΝΕΟ STATE: Για να παρακολουθεί τον δείκτη της τρέχουσας εικόνας
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Εδώ είναι σημαντικό: Βεβαιώσου ότι το 'images' από το Firebase είναι πίνακας.
          // Αν το Firestore σου επιστρέφει ένα απλό string,
          // θα πρέπει να το μετατρέψεις σε πίνακα [string] ή να προσαρμόσεις τα δεδομένα σου στο Firestore.
          const propertyImages = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []);

          setProperty({
            id: docSnap.id,
            ...data,
            images: propertyImages // Χρησιμοποιούμε τον πίνακα που μόλις φτιάξαμε
          } as PropertyDetails);
          // Επαναφορά του δείκτη εικόνας στην αρχή όταν φορτώνει νέο ακίνητο
          setCurrentImageIndex(0);
        } else {
          setProperty(null);
          console.warn("Property not found with ID:", params.id);
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

  // Λειτουργία για μετάβαση στην προηγούμενη εικόνα
  const goToPreviousImage = () => {
    if (property && property.images && property.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Λειτουργία για μετάβαση στην επόμενη εικόνα
  const goToNextImage = () => {
    if (property && property.images && property.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-6 py-8">
        <p>Loading property details...</p>
      </div>
    );

  if (!property)
    return (
      <div className="container mx-auto px-6 py-8">
        <p>Property not found.</p>
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
        {/* Ενότητα Carousel Εικόνων */}
        <div className="relative w-full h-96">
          {property.images && property.images.length > 0 ? (
            <img
              // Εμφάνιση της τρέχουσας εικόνας από τον πίνακα
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
            />
          ) : (
            // Fallback αν δεν υπάρχουν εικόνες
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}

          {/* Κουμπί Προηγούμενης Εικόνας (εμφανίζεται μόνο αν υπάρχουν >1 εικόνες) */}
          {property.images && property.images.length > 1 && (
            <button
              onClick={goToPreviousImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-all duration-200"
              aria-label="Previous Image"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          )}

          {/* Κουμπί Επόμενης Εικόνας (εμφανίζεται μόνο αν υπάρχουν >1 εικόνες) */}
          {property.images && property.images.length > 1 && (
            <button
              onClick={goToNextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-all duration-200"
              aria-label="Next Image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Δείκτες Εικόνων (κουκκίδες στο κάτω μέρος) - Προαιρετικό */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                  } transition-colors duration-200`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </div>
        {/* Τέλος Ενότητας Carousel Εικόνων */}

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