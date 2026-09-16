"use client";
import React, { useEffect, useRef, useState } from "react";

type UserRole = "viewer" | "editor" | "admin" | "super_admin";

type UserMenuProps = {
  name: string;
  role: UserRole;
};

const Header = ({ name, role }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const firstLetter = name.trim().charAt(0).toUpperCase();

  //const canManageUsers = role === "admin" || role === "super_admin";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center justify-center gap-4">
        <div className="font-semibold">Medical Inventory</div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="text-sm">Вітаю, {name}</div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold hover:bg-gray-300"
        >
          {firstLetter}
        </button>

      </div>
    </header>
  );
};

export default Header;
