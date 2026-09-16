"use client";

import { useState } from "react";

const tabs = ["Медицина", "Продукти", "Гігієна"];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("Медицина");

  return (
    <nav className="flex items-end gap-6 mt-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`relative cursor-pointer pb-1 text-sm font-medium transition ${
            activeTab === tab
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}

          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gray-900" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default CategoryTabs;