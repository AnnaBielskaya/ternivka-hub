"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import SearchInput from "./Search";
import CategoryTabs from "./CategoryTabs";
import UserMenu from "./UserMenu";
import InviteUserModal from "@/features/users/components/InviteUserModal";

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

        <div className="flex items-center justify-center gap-5">
          <SearchInput />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Відкрити меню користувача"
            aria-expanded={isOpen}
            className="cursor-pointer flex items-center justify-center gap-2"
          >
            <div className="text-sm font-semibold">{name}</div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold hover:bg-gray-300">
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
          onInviteUser={() => setIsInviteModalOpen(true)}
        />
      )}

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
};

export default Header;
