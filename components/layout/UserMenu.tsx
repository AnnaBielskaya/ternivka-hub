"use client";

import StatusBadge from "../ui/StatusBadge";

import type { UserRole } from "@/features/users/types";

type UserMenuProps = {
  name: string;
  role: UserRole;
  setIsOpen: (value: boolean) => void;
  onProfile: () => void;
  onCreateUser: () => void;
};

const UserMenu = ({
  name,
  role,
  setIsOpen,
  onProfile,
  onCreateUser,
}: UserMenuProps) => {
  const canManageUsers = role === "admin" || role === "super_admin";

  const handleProfile = () => {
    setIsOpen(false);
    onProfile();
  };

  const handleCreateUser = () => {
    setIsOpen(false);
    onCreateUser();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl"
        aria-label="Меню користувача"
      >
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

        <nav className="flex flex-col p-3">
          <button
            type="button"
            onClick={handleProfile}
            className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm transition hover:bg-gray-100"
          >
            Мій профіль
          </button>

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
                onClick={handleCreateUser}
                className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm transition hover:bg-gray-100"
              >
                Створити користувача
              </button>
            </>
          )}
        </nav>

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
