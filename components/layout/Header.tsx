"use client";

import { useEffect, useState } from "react";

import { UserRole } from "@/features/users/types";

import Logo from "./Logo";
import SearchInput from "./Search";
import CategoryTabs from "./CategoryTabs";
import UserMenu from "./UserMenu";
import CreateUserModal from "@/features/users/components/CreateUserModal";

type HeaderProps = {
  name: string;
  role: UserRole;
};

const Header = ({ name, role }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const firstLetter = name.trim().charAt(0).toUpperCase();

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
      <header className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-8">
            <Logo />

            <div className="hidden sm:block">
              <CategoryTabs />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <SearchInput />
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Відкрити меню користувача"
              aria-expanded={isOpen}
              className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50"
            >
              <span className="hidden max-w-40 truncate text-[13px] font-medium text-slate-700 sm:block">
                {name}
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
                {firstLetter}
              </span>
            </button>
          </div>
        </div>

        <div className="sm:hidden">
          <SearchInput />
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <div className="overflow-x-auto">
          <div className="flex min-h-16 min-w-max items-center justify-around px-2">
            <CategoryTabs />
          </div>
        </div>
      </nav>

      {isOpen && (
        <UserMenu
          name={name}
          role={role}
          setIsOpen={setIsOpen}
          onCreateUser={() => setIsInviteModalOpen(true)}
        />
      )}

      <CreateUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
};

export default Header;
