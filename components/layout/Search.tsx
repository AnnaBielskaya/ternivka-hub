"use client";

import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-64">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />

      <input
        type="search"
        placeholder="Пошук..."
        className="h-8 w-full rounded-full border border-gray-200 bg-white pl-8 pr-4 text-xs outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
      />
    </div>
  );
};

export default SearchInput;