"use client";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

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
          <CustomButton variant="secondary" onClick={onClose}>
            Скасувати
          </CustomButton>

          <CustomButton type="submit" form="invite-user-form">
            Запросити
          </CustomButton>
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
