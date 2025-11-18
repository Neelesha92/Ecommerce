// src/pages/ProductsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";
import SidebarFilter from "../components/SidebarFilter";
import SortingDropdown from "../components/SortingDropdown";
import Navbar from "../components/Navbar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: number;
  stock?: number;
}

interface Category {
  id: number;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & sorting
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const [search, setSearch] = useState<string>("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // FETCH PRODUCTS (Wrapped in useCallback)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (categoryId) params.append("categoryId", categoryId.toString());
      if (priceMin) params.append("priceMin", priceMin.toString());
      if (priceMax) params.append("priceMax", priceMax.toString());
      if (sort) params.append("sort", sort);
      if (search) params.append("q", search);

      const res = await fetch(
        `http://localhost:5000/api/products/filter?${params.toString()}`
      );

      const data = await res.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, categoryId, priceMin, priceMax, sort, search]);

  // On mount → fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // When filters/sort/search/page change → fetch products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-100 p-5 rounded-lg shadow-md sticky top-24 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Filters</h2>
          <SidebarFilter
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            search={search}
            setSearch={setSearch}
            categories={categories}
          />
        </div>

        {/* Products Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Sorting + Count */}
          <div className="flex justify-between items-center mb-4">
            <SortingDropdown sort={sort} setSort={setSort} />
            <div className="text-blue-800 font-medium">
              {products.length} products found
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20 text-blue-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-blue-500">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
