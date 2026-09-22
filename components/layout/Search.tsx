"use client";

import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-64">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="search"
        placeholder="Пошук..."
        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-4 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
      />
    </div>
  );
};

export default SearchInput;
