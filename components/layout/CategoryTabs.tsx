"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    name: "Препарати",
    link: "/",
  },
  {
    name: "Розхідники",
    link: "/category/supplies",
  },
  {
    name: "Обладнання",
    link: "/category/equipment",
  },
];

type CategoryTabsProps = {
  variant?: "header" | "bottom";
};

const CategoryTabs = ({ variant = "header" }: CategoryTabsProps) => {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="grid w-full grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.link;

          return (
            <Link
              key={tab.name}
              href={tab.link}
              className={`flex min-w-0 items-center justify-center rounded-lg px-1 py-2.5 text-center text-[11px] leading-4 transition sm:py-3 sm:text-xs ${
                isActive
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : "font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="truncate">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.link;

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className={`py-1 text-[13px] transition ${
              isActive
                ? "font-semibold text-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
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
