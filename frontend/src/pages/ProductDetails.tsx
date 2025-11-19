// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category?: { id: number; name: string };
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product || data); // adjust depending on backend response
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-center py-20 text-blue-500">Loading...</div>;
  if (!product)
    return (
      <div className="text-center py-20 text-blue-500">Product not found</div>
    );

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="flex-1 bg-white rounded-lg shadow p-4 flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-[400px] object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-blue-900">{product.name}</h1>
            {product.category && (
              <div className="text-blue-700 font-medium">
                Category: {product.category.name}
              </div>
            )}
            <div className="text-2xl font-semibold text-blue-800">
              ${product.price}
            </div>
            <div className="text-gray-700">{product.description}</div>
            <div className="text-green-600 font-medium">
              {product.stock && product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </div>

            <button
              className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
