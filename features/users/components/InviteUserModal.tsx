"use client";

import Modal from "@/components/ui/Modal";

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const InviteUserModal = ({ isOpen, onClose }: InviteUserModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Запросити користувача"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Скасувати
          </button>

          <button
            type="submit"
            form="invite-user-form"
            className="h-10 cursor-pointer rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Запросити
          </button>
        </div>
      }
    >
      <form id="invite-user-form">
        <div className="p-6">
          <label
            htmlFor="invite-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="example@email.com"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
