"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Препарати", link: "/" },
  { name: "Медичні розхідники", link: "/category/medicalsupplies" },
  { name: "Мед. обладнання", link: "/category/equipment" },
];

const CategoryTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="mt-1 flex items-end gap-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.link;

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className={`relative pb-1 text-sm font-medium transition ${
              isActive ? "text-gray-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.name}

            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gray-900" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryTabs;
