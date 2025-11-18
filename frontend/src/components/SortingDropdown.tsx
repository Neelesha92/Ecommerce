// src/components/SortingDropdown.tsx
import React from "react";

interface SortingDropdownProps {
  sort: string;
  setSort: (val: string) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ sort, setSort }) => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <label className="font-semibold">Sort By:</label>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
