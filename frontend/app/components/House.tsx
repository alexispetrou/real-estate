import React from "react";
import Link from "next/link";

interface HouseProps {
  id: number;
  images: string;
  title: string;
  price_sale: number;
  area: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
}

const House = ({ property }: { property: HouseProps }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img
        src={property.images}
        alt={property.title}
        className="w-full h-55 object-cover"
      />
      <div className="p-2.5">
        <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
        <p className="text-blue-500 font-bold mb-2">
          €{property.price_sale.toLocaleString()}
        </p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{property.area}</span>
          <span>{property.size} m²</span>
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
        </div>
        <Link href={`/properties/${property.id}`}>
          <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default House;
