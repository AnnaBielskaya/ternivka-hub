"use client";

import { useState } from "react";

const tabs = ["Медицина", "Продукти", "Гігієна"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Медицина");

  return (
    <main className="p-6">
      <div className="flex items-end gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer relative pb-1 text-sm font-medium transition ${
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
      </div>
      <div className="mt-3">
        <p className="text-gray-600">{activeTab}: поки ніц нема</p>
      </div>
    </main>
  );
}
