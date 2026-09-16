"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

type UserRole = "viewer" | "editor" | "admin" | "super_admin";

type UserMenuProps = {
  name: string;
  role: UserRole;
};

const Header = ({ name, role }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const firstLetter = name.trim().charAt(0).toUpperCase();

  const canManageUsers = role === "admin" || role === "super_admin";

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Logo/>

        <div className="flex items-center justify-center gap-4">
          <div className="text-sm">Вітаю, {name}</div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Відкрити меню користувача"
            aria-expanded={isOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm font-semibold hover:bg-gray-300"
          >
            {firstLetter}
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Side menu */}
          <aside
            ref={menuRef}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl"
            aria-label="Меню користувача"
          >
            {/* Header of side menu */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <div className="text-lg font-semibold">{name}</div>

                <div className="mt-1 text-sm text-gray-500">{role}</div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Закрити меню"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Menu */}
            <nav className="flex flex-col p-3">
              <a
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm hover:bg-gray-100"
              >
                Мій профіль
              </a>

              {canManageUsers && (
                <a
                  href="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Користувачі
                </a>
              )}
            </nav>

            {/* Bottom */}
            <div className="mt-auto border-t p-3">
              <button
                type="button"
                disabled
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-400"
              >
                Вийти
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;
