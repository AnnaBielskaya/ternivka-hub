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
      <header>
        <div className="px-4 py-3 sm:px-6 sm:py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-7 sm:gap-8">
              <Logo />

              <div className="hidden sm:block">
                <CategoryTabs variant="header" />
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
                className="group flex cursor-pointer items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50"
              >
                <span className="hidden max-w-40 truncate text-[13px] font-medium text-slate-700 sm:block">
                  {name}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600 transition group-hover:bg-slate-200">
                  {firstLetter}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3 sm:hidden">
            <SearchInput />
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.04)] backdrop-blur-md sm:hidden">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-h-16 min-w-max items-center justify-center px-3">
            <CategoryTabs variant="bottom" />
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
