import React from "react";

interface SidebarFilterProps {
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
  priceMin: number | null;
  setPriceMin: (val: number | null) => void;
  priceMax: number | null;
  setPriceMax: (val: number | null) => void;
  search: string;
  setSearch: (val: string) => void;
  categories: { id: number; name: string }[];
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  categoryId,
  setCategoryId,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  search,
  setSearch,
  categories,
}) => {
  return (
    <div className=" p-4 rounded space-y-4">
      <h2 className="font-semibold mb-2">Filters</h2>

      {/* Search */}
      <div>
        <label className="block mb-1">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-1 rounded"
          placeholder="Search products..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1">Category</label>
        <select
          value={categoryId || ""}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border p-1 rounded"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Min */}
      <div>
        <label className="block mb-1">Price Min</label>
        <input
          type="number"
          value={priceMin || ""}
          onChange={(e) =>
            setPriceMin(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border p-1 rounded"
        />
      </div>

      {/* Price Max */}
      <div>
        <label className="block mb-1">Price Max</label>
        <input
          type="number"
          value={priceMax || ""}
          onChange={(e) =>
            setPriceMax(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border p-1 rounded"
        />
      </div>
    </div>
  );
};

export default SidebarFilter;
