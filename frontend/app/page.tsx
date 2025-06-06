"use client";

import { useState } from "react";

export default function Home() {
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [size, setSize] = useState({ min: "", max: "" });
  const [selectedOption, setSelectedOption] = useState<"sale" | "rent">("sale");

  // Helper function to generate price options
  const generatePriceOptions = () => {
    const options = [];
    for (let i = 10000; i <= 200000; i += 10000) {
      options.push(i);
    }
    for (let i = 225000; i <= 400000; i += 25000) {
      options.push(i);
    }
    return options;
  };

  // Helper function to generate size options
  const generateSizeOptions = () => {
    const options = [];
    for (let i = 10; i <= 200; i += 10) {
      options.push(i);
    }
    for (let i = 225; i <= 250; i += 25) {
      options.push(i);
    }
    return options;
  };

  return (
    <div className="relative h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg')]">
      <div className="backdrop-blur-xs">
        <div className="relative z-10 p-1">
          <div className="grid  items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="flex items-center gap-4 rounded-tl-lg rounded-br-lg bg-blue-200/80 p-3 shadow-md outline outline-black/5 text-black text-2xl ">
              Search for your new dream Home
            </h1>
            <div className="p-8 rounded-lg shadow-2xl w-4/5 max-w-full flex flex-col items-center bg-white/20 border border-gray-300/70">
              <div className="flex flex-col mt-6 gap-6 w-full">
                <div className="justify-self-start w-full">
                  <div className="flex flex-row gap-4 text-lg font-medium">
                    <button
                      className={`px-4 py-2 rounded-lg shadow border-2 ${
                        selectedOption === "sale"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
                      }`}
                      onClick={() => setSelectedOption("sale")}
                    >
                      Sale
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg shadow border-2 ${
                        selectedOption === "rent"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
                      }`}
                      onClick={() => setSelectedOption("rent")}
                    >
                      Rent
                    </button>
                  </div>
                </div>

                <div className="flex flex-row gap-50">
                  <div className="flex items-center gap-2 w-full">
                    <label htmlFor="category" className="text-lg font-semibold">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/60"
                    >
                      <option value="">Select Category</option>
                      <option value="house">House</option>
                      <option value="field">Field</option>
                      <option value="land">Land</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <label htmlFor="area" className="text-lg font-semibold">
                      Area
                    </label>
                    <select
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/60 "
                    >
                      <option value="">Attica</option>
                      <option value="house">Crete</option>
                      <option value="field">Mykonos</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-row gap-15">
                  <div className="flex items-center gap-2 w-full">
                    <label htmlFor="price" className="text-lg font-semibold">
                      Price Range
                    </label>
                    <div className="flex gap-3 w-full">
                      <select
                        id="price-min"
                        value={priceRange.min}
                        onChange={(e) => {
                          const newMin = e.target.value;
                          setPriceRange({
                            max:
                              priceRange.max &&
                              Number(newMin) > Number(priceRange.max)
                                ? ""
                                : priceRange.max,
                            min: newMin,
                          });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
                      >
                        <option value="">Min Price</option>
                        {generatePriceOptions().map((price) => (
                          <option key={`min-${price}`} value={price}>
                            €{price.toLocaleString()}
                          </option>
                        ))}
                      </select>

                      <select
                        id="price-max"
                        value={priceRange.max}
                        onChange={(e) => {
                          const newMax = e.target.value;
                          setPriceRange({
                            min:
                              priceRange.min &&
                              Number(newMax) < Number(priceRange.min)
                                ? ""
                                : priceRange.min,
                            max: newMax,
                          });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
                      >
                        <option value="">Max Price</option>
                        {generatePriceOptions().map((price) => (
                          <option key={`max-${price}`} value={price}>
                            €{price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    <label htmlFor="size" className="text-lg font-semibold">
                      Size (m²)
                    </label>
                    <div className="flex gap-2 w-full">
                      <select
                        id="size-min"
                        value={size.min}
                        onChange={(e) => {
                          const newMin = e.target.value;
                          setSize({
                            max:
                              size.max && Number(newMin) > Number(size.max)
                                ? ""
                                : size.max,
                            min: newMin,
                          });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
                      >
                        <option value="">Min Size</option>
                        {generateSizeOptions().map((sizeOption) => (
                          <option key={`min-${sizeOption}`} value={sizeOption}>
                            {sizeOption} m²
                          </option>
                        ))}
                      </select>

                      <select
                        id="size-max"
                        value={size.max}
                        onChange={(e) => {
                          const newMax = e.target.value;
                          setSize({
                            min:
                              size.min && Number(newMax) < Number(size.min)
                                ? ""
                                : size.min,
                            max: newMax,
                          });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
                        size={1}
                      >
                        <option value="">Max Size</option>
                        {generateSizeOptions().map((sizeOption) => (
                          <option key={`min-${sizeOption}`} value={sizeOption}>
                            {sizeOption} m²
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}