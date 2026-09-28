"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    name: "Препарати",
    link: "/",
    icon: "💊",
  },
  {
    name: "Розхідники",
    link: "/category/supplies",
    icon: "🩹",
  },
  {
    name: "Обладнання",
    link: "/category/equipment",
    icon: "🩺",
  },
];

type CategoryTabsProps = {
  variant?: "header" | "bottom";
};

const CategoryTabs = ({ variant = "header" }: CategoryTabsProps) => {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-50 p-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.link;

          return (
            <Link
              key={tab.name}
              href={tab.link}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-center transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center text-[18px] leading-none transition ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {tab.icon}
              </span>

              <span
                className={`truncate text-[12px] leading-4 ${
                  isActive
                    ? "font-semibold text-slate-900"
                    : "font-medium text-slate-400"
                }`}
              >
                {tab.name}
              </span>

              {isActive ? (
                <span className="absolute bottom-1 h-0.5 w-5 rounded-full bg-slate-800" />
              ) : null}
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
