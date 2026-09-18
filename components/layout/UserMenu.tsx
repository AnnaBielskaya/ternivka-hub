import { useRef } from "react";
import StatusBadge from "../ui/StatusBadge";

type UserMenuProps = {
  name: string;
  role: UserRole;
  setIsOpen: (value: boolean) => void;
};

const UserMenu = ({name, role, setIsOpen} : UserMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const canManageUsers = role === "admin" || role === "super_admin";

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
        ref={menuRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl"
        aria-label="Меню користувача"
      >
        {/* Header of side menu */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-1">
            <div className="text-lg font-semibold">{name}</div>
            <StatusBadge variant="success" title={role} />
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
