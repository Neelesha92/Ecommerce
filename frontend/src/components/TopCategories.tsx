import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  image: string;
}

const TopCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading)
    return <p className="text-center py-10">Loading categories...</p>;
  if (categories.length === 0)
    return <p className="text-center py-10">No categories found.</p>;

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Top Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={`/categories/${category.id}`}
              key={category.id}
              className="flex flex-col items-center bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 text-center">
                <h3 className="text-gray-800 font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
