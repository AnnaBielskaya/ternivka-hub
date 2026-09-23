"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import DropdownSelect from "@/components/ui/DropdownSelect";

import { updateUser } from "../actions/update-user";
import type { AdminUser } from "../actions/get-users";
import type { UserRole } from "../types";

type EditUserModalProps = {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
};

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "editor",
    label: "Редагування",
  },
  {
    value: "admin",
    label: "Адміністратор",
  },
];

const EditUserModal = ({ user, onClose, onSaved }: EditUserModalProps) => {
  const [phone, setPhone] = useState(user.phone ?? "");

  const [name, setName] = useState(user.name ?? "");

  const [role, setRole] = useState<UserRole>(user.role);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const result = await updateUser(user.id, name, phone, role);

    setIsSubmitting(false);

    if (result.status === "error") {
      setError(result.message);
      return;
    }

    onSaved();
  };

  return (
    <Modal
      isOpen={true}
      title="Редагувати користувача"
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="edit-user-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Збереження..." : "Зберегти"}
          </CustomButton>
        </div>
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit}>
        <div className="space-y-5 p-4 sm:p-6">
          <div>
            <label
              htmlFor="edit-user-phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Телефон
            </label>

            <input
              id="edit-user-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+380..."
              required
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-user-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Позивний
            </label>

            <input
              id="edit-user-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Роль
            </label>

            <DropdownSelect
              value={role}
              options={ROLE_OPTIONS}
              variant="outline"
              disabled={isSubmitting}
              onChange={(value) => {
                if (value) {
                  setRole(value as UserRole);
                }
              }}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
