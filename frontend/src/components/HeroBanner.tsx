import React from "react";
import { Link } from "react-router-dom";

const HeroBanner: React.FC = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            MegaMart – Your One-Stop Shop
          </h1>
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            Discover amazing products at unbeatable prices. Shop now and enjoy
            exclusive deals!
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg text-sm sm:text-base hover:bg-blue-600 transition"
          >
            Shop Now
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex-1">
          <img
            src="/hero-banner.png" // replace with your image path
            alt="Hero Banner"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
