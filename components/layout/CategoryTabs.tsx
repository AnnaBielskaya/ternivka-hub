"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Препарати", link: "/" },
  { name: "Розхідники", link: "/category/medicalsupplies" },
  { name: "Обладнання", link: "/category/equipment" },
  { name: "Такмед", link: "/category/tacmed" },
];

type CategoryTabsProps = {
  variant?: "header" | "bottom";
};

const CategoryTabs = ({ variant = "header" }: CategoryTabsProps) => {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="flex min-w-max items-stretch gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.link;

          return (
            <Link
              key={tab.name}
              href={tab.link}
              className={`flex min-w-[88px] items-center justify-center rounded-xl px-3 py-2.5 text-[12px] font-medium transition ${
                isActive
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="inline-flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.link;

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryTabs;
