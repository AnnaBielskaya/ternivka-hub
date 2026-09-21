"use client";

import type { ReactNode } from "react";

import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import type { InventoryItem, StockRow } from "@/features/inventory/types";

type MedicineDetailsModalProps = {
  item: InventoryItem;
  stock: StockRow[];
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const formatExpiry = (month: number, year: number) => {
  return `${String(month).padStart(2, "0")}/${year}`;
};

const MedicineDetailsModal = ({
  item,
  stock,
  onClose,
  onEdit,
  onDelete,
}: MedicineDetailsModalProps) => {
  const statusVariant = item.needsRefill ? "warning" : "success";

  const statusTitle = item.needsRefill ? "Потребує поповнення" : "Достатньо";

  const medicineSubtitle = [item.medicine_form?.name, item.dosage, item.volume]
    .filter(Boolean)
    .join(" · ");

  const sortedStock = [...stock].sort((a, b) => {
    const dateA = a.expiry_year * 100 + a.expiry_month;

    const dateB = b.expiry_year * 100 + b.expiry_month;

    return dateA - dateB;
  });

  return (
    <Modal
      isOpen={true}
      title={
        <div className="min-w-0">
          <h2 className="min-w-0 text-lg font-semibold leading-tight text-slate-900">
            {item.name}
          </h2>

          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
            {medicineSubtitle && (
              <p className="text-xs text-slate-500">{medicineSubtitle}</p>
            )}

            <StatusBadge variant={statusVariant} title={statusTitle} />
          </div>
        </div>
      }
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="h-9 cursor-pointer rounded-lg px-3 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Видалити
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 cursor-pointer rounded-lg border border-gray-200 px-3.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Закрити
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="h-9 cursor-pointer rounded-lg bg-gray-800 px-4 text-xs font-semibold text-white transition hover:bg-gray-700"
              >
                Редагувати
              </button>
            )}
          </div>
        </div>
      }
      size="lg"
    >
      <div className="space-y-6 p-5">
        <section>
          <SectionTitle title="Наявність" />

          <div className="grid grid-cols-3 gap-2.5">
            <SummaryItem
              icon={<BoxesIcon />}
              label="Загальна кількість"
              value={`${item.quantity} ${item.unit}`}
              highlight={item.needsRefill}
            />

            <SummaryItem
              icon={<MinusCircleIcon />}
              label="Мінімальний залишок"
              value={`${item.minimum_quantity} ${item.unit}`}
            />

            <SummaryItem
              icon={<CalendarIcon />}
              label="Найближчий термін придатності"
              value={item.nearestExpiry ?? "—"}
            />
          </div>
        </section>

        <SectionDivider />

        <section>
          <SectionTitle title="Характеристики" />

          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            <InfoItem label="Діюча речовина" value={item.active_ingredient} />

            <InfoItem label="Форма випуску" value={item.medicine_form?.name} />

            <InfoItem label="Призначення" value={item.medicine_purpose?.name} />

            <InfoItem label="Дозування" value={item.dosage} />

            <InfoItem label="Обʼєм" value={item.volume} />

            <InfoItem label="Одиниця обліку" value={item.unit} />
          </div>
        </section>

        {item.description && (
          <>
            <SectionDivider />

            <section>
              <SectionTitle title="Опис" />

              <div className="rounded-lg bg-slate-50 px-3.5 py-3">
                <p className="whitespace-pre-wrap text-xs leading-5 text-slate-600">
                  {item.description}
                </p>
              </div>
            </section>
          </>
        )}

        <SectionDivider />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle title="Партії" className="mb-0" />

            {sortedStock.length > 0 && (
              <span className="text-[11px] text-slate-400">
                {sortedStock.length}{" "}
                {sortedStock.length === 1 ? "партія" : "партії"}
              </span>
            )}
          </div>

          {sortedStock.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {sortedStock.map((stockItem, index) => {
                const isNearest = index === 0;

                return (
                  <div
                    key={stockItem.id}
                    className={`rounded-lg px-3.5 py-3 ${
                      isNearest ? "bg-blue-50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                            isNearest
                              ? "bg-blue-100 text-blue-600"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          <CalendarIcon />
                        </div>

                        <div className="min-w-0">
                          <span className="block text-[11px] text-slate-400">
                            Термін придатності
                          </span>

                          <span
                            className={`mt-0.5 block text-[13px] font-semibold ${
                              isNearest ? "text-blue-800" : "text-slate-900"
                            }`}
                          >
                            {formatExpiry(
                              stockItem.expiry_month,
                              stockItem.expiry_year
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5">
                        <div className="text-right">
                          <span className="block text-[11px] text-slate-400">
                            Кількість
                          </span>

                          <span className="mt-0.5 block text-[13px] font-semibold text-slate-900">
                            {stockItem.quantity} {item.unit}
                          </span>
                        </div>

                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                            isNearest
                              ? "bg-blue-100 text-blue-600"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          <BoxesIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
              Інформація про партії відсутня
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

type SectionTitleProps = {
  title: string;
  className?: string;
};

const SectionTitle = ({ title, className = "mb-3" }: SectionTitleProps) => {
  return (
    <h3 className={`text-xs font-semibold text-slate-900 ${className}`}>
      {title}
    </h3>
  );
};

type InfoItemProps = {
  label: string;
  value: string | null | undefined;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="min-w-0">
      <span className="block text-[11px] text-slate-400">{label}</span>

      <span className="mt-1 block truncate text-[13px] font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
};

type SummaryItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
};

const SummaryItem = ({
  icon,
  label,
  value,
  highlight = false,
}: SummaryItemProps) => {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${
        highlight ? "bg-red-50" : "bg-slate-50"
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
          highlight ? "bg-red-100 text-red-500" : "bg-white text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <span
          className={`block text-[10px] ${
            highlight ? "text-red-500" : "text-slate-400"
          }`}
        >
          {label}
        </span>

        <span
          className={`mt-0.5 block truncate text-[13px] font-semibold ${
            highlight ? "text-red-700" : "text-slate-900"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

const CalendarIcon = () => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 2.75V5M15 2.75V5M3.75 7.25H16.25M5 4H15C16.1 4 17 4.9 17 6V15C17 16.1 16.1 17 15 17H5C3.9 17 3 16.1 3 15V6C3 4.9 3.9 4 5 4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BoxesIcon = () => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 3L16 6.25L10 9.5L4 6.25L10 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 6.25V13.75L10 17L16 13.75V6.25M10 9.5V17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MinusCircleIcon = () => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r="6.75"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M7 10H13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SectionDivider = () => {
  return <div className="border-t border-slate-100" />;
};

export default MedicineDetailsModal;
