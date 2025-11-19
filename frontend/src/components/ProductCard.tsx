// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className=" rounded-lg p-3 shadow hover:shadow-lg transition">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <h2 className="mt-2 font-semibold">{product.name}</h2>
        <p className="text-black-600 mt-1">${product.price}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-3 inline-block text-blue-600 hover:underline text-sm"
        >
          View Details
        </Link>
      </div>
    </Link>
  );
};

export default ProductCard;
