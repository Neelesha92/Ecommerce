// src/components/ProductCard.tsx
import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="border rounded-lg p-3 shadow hover:shadow-lg transition">
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
      <p className="text-blue-600 font-bold mt-1">${product.price}</p>
    </div>
  );
};

export default ProductCard;
