"use client";

import Link from "next/link";
import { useState } from "react";

const tabs = [
  { name: "Медицина", link: "/" },
  { name: "Медичні розхідники", link: "/category/medicalsupplies" },
  { name: "Мед. обладнання", link: "/category/equipment" },
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("Медицина");

  return (
    <nav className="flex items-end gap-6 mt-1">
      {tabs.map((tab) => (
        <Link key={tab.name} href={tab.link}>
          <button
            type="button"
            onClick={() => setActiveTab(tab.name)}
            className={`relative cursor-pointer pb-1 text-sm font-medium transition ${
              activeTab === tab.name
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.name}

            {activeTab === tab.name && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gray-900" />
            )}
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default CategoryTabs;
