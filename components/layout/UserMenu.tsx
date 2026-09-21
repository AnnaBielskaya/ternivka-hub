"use client";

import { UserRole } from "@/features/users/types";
import StatusBadge from "../ui/StatusBadge";

type UserMenuProps = {
  name: string;
  role: UserRole;
  setIsOpen: (value: boolean) => void;
  onInviteUser: () => void;
};

const UserMenu = ({ name, role, setIsOpen, onInviteUser }: UserMenuProps) => {
  const canManageUsers = role === "admin" || role === "super_admin";

  const handleInviteUser = () => {
    setIsOpen(false);
    onInviteUser();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Side menu */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl"
        aria-label="Меню користувача"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-1">
            <div className="truncate text-lg font-semibold">{name}</div>

            <StatusBadge variant="success" title={role} />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Закрити меню"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col p-3">
          <a
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="rounded-xl px-4 py-3 text-sm transition hover:bg-gray-100"
          >
            Мій профіль
          </a>

          {canManageUsers && (
            <>
              <a
                href="/admin/users"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm transition hover:bg-gray-100"
              >
                Користувачі
              </a>

              <button
                type="button"
                onClick={handleInviteUser}
                className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm transition hover:bg-gray-100"
              >
                Запросити користувача
              </button>
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="mt-auto border-t border-gray-100 p-3">
          <form action="/signout" method="POST">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100"
            >
              Вийти
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};

export default UserMenu;
