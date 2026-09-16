"use client";

import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-64">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="search"
        placeholder="Пошук..."
        className="h-8 w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
      />
    </div>
  );
};

export default SearchInput;