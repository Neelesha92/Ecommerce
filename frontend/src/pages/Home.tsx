import React from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import TopCategories from "../components/TopCategories";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      <HeroBanner />
      <FeaturedProducts />
      <TopCategories />
      <Footer />
    </div>
  );
};

export default Home;
