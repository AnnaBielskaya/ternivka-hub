"use client";

import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import type {
  InventoryItem,
  StockRow,
} from "@/features/inventory/types";

type MedicineDetailsModalProps = {
  item: InventoryItem;
  stock: StockRow[];
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const formatExpiry = (
  month: number,
  year: number,
) => {
  return `${String(month).padStart(2, "0")}/${year}`;
};

const MedicineDetailsModal = ({
  item,
  stock,
  onClose,
  onEdit,
  onDelete,
}: MedicineDetailsModalProps) => {
  const statusVariant = item.needsRefill
    ? "warning"
    : "success";

  const statusTitle = item.needsRefill
    ? "Потребує поповнення"
    : "Достатньо";

  const medicineSubtitle = [
    item.medicine_form?.name,
    item.dosage,
    item.volume,
  ]
    .filter(Boolean)
    .join(" · ");

  const sortedStock = [...stock].sort(
    (a, b) => {
      const dateA =
        a.expiry_year * 100 +
        a.expiry_month;

      const dateB =
        b.expiry_year * 100 +
        b.expiry_month;

      return dateA - dateB;
    },
  );

  return (
    <Modal
      isOpen={true}
      title={
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="min-w-0 text-xl font-semibold leading-tight text-gray-900">
              {item.name}
            </h2>

            <StatusBadge
              variant={statusVariant}
              title={statusTitle}
            />
          </div>

          {medicineSubtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {medicineSubtitle}
            </p>
          )}
        </div>
      }
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="h-10 cursor-pointer rounded-xl px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Видалити
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Закрити
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="h-10 cursor-pointer rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Редагувати
              </button>
            )}
          </div>
        </div>
      }
      size="lg"
    >
      <div className="space-y-7 p-6">
        <section>
          <SectionTitle title="Залишок" />

          <div className="grid grid-cols-3 gap-4">
            <SummaryItem
              label="Загальна кількість"
              value={`${item.quantity} (${item.unit})`}
              highlight={item.needsRefill}
            />

            <SummaryItem
              label="Мінімальна кількість"
              value={`${item.minimum_quantity} (${item.unit})`}
            />

            <SummaryItem
              label="Найближчий строк"
              value={item.nearestExpiry ?? "—"}
            />
          </div>
        </section>

        <SectionDivider />

        <section>
          <SectionTitle title="Характеристики" />

          <div className="grid grid-cols-3 gap-x-8 gap-y-5">
            <InfoItem
              label="Діюча речовина"
              value={item.active_ingredient}
            />

            <InfoItem
              label="Форма випуску"
              value={item.medicine_form?.name}
            />

            <InfoItem
              label="Призначення"
              value={item.medicine_purpose?.name}
            />

            <InfoItem
              label="Дозування"
              value={item.dosage}
            />

            <InfoItem
              label="Обʼєм"
              value={item.volume}
            />

            <InfoItem
              label="Одиниця обліку"
              value={item.unit}
            />
          </div>
        </section>

        <SectionDivider />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle
              title="Партії"
              className="mb-0"
            />

            {sortedStock.length > 0 && (
              <span className="text-xs text-gray-400">
                {sortedStock.length}{" "}
                {sortedStock.length === 1
                  ? "партія"
                  : "партії"}
              </span>
            )}
          </div>

          {sortedStock.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {sortedStock.map(
                (stockItem) => (
                  <div
                    key={stockItem.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="block text-xs text-gray-400">
                          Термін придатності
                        </span>

                        <span className="mt-1 block text-base font-semibold text-gray-900">
                          {formatExpiry(
                            stockItem.expiry_month,
                            stockItem.expiry_year,
                          )}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-xs text-gray-400">
                          Кількість
                        </span>

                        <span className="mt-1 block text-base font-semibold text-gray-900">
                          {stockItem.quantity}{" "}
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
              Інформація про партії відсутня
            </div>
          )}
        </section>

        {item.description && (
          <>
            <SectionDivider />

            <section>
              <SectionTitle title="Опис" />

              <div className="rounded-xl bg-gray-50 px-4 py-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

type SectionTitleProps = {
  title: string;
  className?: string;
};

const SectionTitle = ({
  title,
  className = "mb-4",
}: SectionTitleProps) => {
  return (
    <h3
      className={`text-sm font-semibold text-gray-900 ${className}`}
    >
      {title}
    </h3>
  );
};

type InfoItemProps = {
  label: string;
  value: string | null | undefined;
};

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div className="min-w-0">
      <span className="block text-xs text-gray-400">
        {label}
      </span>

      <span className="mt-1.5 block truncate text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
};

type SummaryItemProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

const SummaryItem = ({
  label,
  value,
  highlight = false,
}: SummaryItemProps) => {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        highlight
          ? "border-red-100 bg-red-50"
          : "border-gray-100 bg-gray-50"
      }`}
    >
      <span
        className={`block text-xs ${
          highlight
            ? "text-red-500"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`mt-1.5 block text-lg font-semibold ${
          highlight
            ? "text-red-700"
            : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const SectionDivider = () => {
  return (
    <div className="border-t border-gray-100" />
  );
};

export default MedicineDetailsModal;