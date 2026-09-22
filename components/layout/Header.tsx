"use client";

import { useEffect, useState } from "react";

import Logo from "./Logo";
import SearchInput from "./Search";
import CategoryTabs from "./CategoryTabs";
import UserMenu from "./UserMenu";
import { UserRole } from "@/features/users/types";
import CreateUserModal from "@/features/users/components/CreateUserModal";

type UserMenuProps = {
  name: string;
  role: UserRole;
};

const Header = ({ name, role }: UserMenuProps) => {
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
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Logo />

          <CategoryTabs />
        </div>

        <div className="flex items-center gap-4">
          <SearchInput />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Відкрити меню користувача"
            aria-expanded={isOpen}
            className="flex cursor-pointer items-center gap-2 rounded-lg transition hover:bg-slate-50"
          >
            <div className="text-[13px] font-medium text-slate-700">{name}</div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
              {firstLetter}
            </div>
          </button>
        </div>
      </header>

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
