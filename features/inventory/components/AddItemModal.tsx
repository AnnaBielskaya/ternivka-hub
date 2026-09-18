"use client";

const MODAL_CONFIG = {
  medicine: {
    title: "Додати препарат",
  },
  medicalsupplies: {
    title: "Додати медичний розхідник",
  },
  equipment: {
    title: "Додати медичне обладнання",
  },
} as const;

type AddItemModalProps = {
  variant: keyof typeof MODAL_CONFIG;
  isOpen: boolean;
  onClose: () => void;
};

const AddItemModal = ({ variant, isOpen, onClose }: AddItemModalProps) => {
  if (!isOpen) {
    return null;
  }

  const { title } = MODAL_CONFIG[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Закрити"
          >
            ×
          </button>
        </div>

        <div className="text-sm text-gray-500">Тут буде форма додавання.</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Скасувати
          </button>

          <button
            type="button"
            className="h-10 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Додати
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
