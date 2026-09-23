"use client";

import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-full lg:w-64">
      <Search
        size={15}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="search"
        placeholder="Пошук..."
        className="h-10 w-full rounded-xl border border-slate-200/80 bg-slate-50/80 pl-9 pr-4 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
};

export default SearchInput;
