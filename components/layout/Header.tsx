"use client";

import { useEffect, useState } from "react";

import type { UserRole } from "@/features/users/types";

import Logo from "./Logo";
import CategoryTabs from "./CategoryTabs";
import UserMenu from "./UserMenu";
import CreateUserModal from "@/features/users/components/CreateUserModal";
import UserProfileModal from "@/features/users/components/UserProfileModal";

type HeaderProps = {
  userId: string;
  name: string;
  role: UserRole;
};

const Header = ({ userId, name, role }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
            <div className="flex min-w-0 items-center gap-7 lg:gap-8">
              <Logo />

              <div className="hidden lg:block">
                <CategoryTabs variant="header" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Відкрити меню користувача"
                aria-expanded={isOpen}
                className="group flex cursor-pointer items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50"
              >
                <span className="hidden max-w-40 truncate text-[13px] font-medium text-slate-700 lg:block">
                  {name}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600 transition group-hover:bg-slate-200">
                  {firstLetter}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <UserMenu
          name={name}
          role={role}
          setIsOpen={setIsOpen}
          onProfile={() => setIsProfileModalOpen(true)}
          onCreateUser={() => setIsInviteModalOpen(true)}
        />
      )}

      <CreateUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        userId={userId}
        name={name}
        role={role}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;
