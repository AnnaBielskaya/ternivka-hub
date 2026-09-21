"use client";

import Modal from "@/components/ui/Modal";
import type { InventoryItem, StockRow } from "@/features/inventory/types";
import AvailabilityItem from "./AvailabilityItem";
import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
import SectionDivider from "@/components/ui/SectionDivider";
import BoxesIcon from "@/components/inventory/icons/BoxesIcon";
import MinusCircleIcon from "@/components/inventory/icons/MinusCircleIcon";
import SectionTitle from "@/components/ui/SectionTitle";

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

          {medicineSubtitle && (
            <p className="mt-1 text-xs text-slate-500">{medicineSubtitle}</p>
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
      <div className="space-y-5 p-5">
        <section>
          <SectionTitle title="Наявність" />

          <div className="grid grid-cols-3 gap-2.5">
            <AvailabilityItem
              icon={<BoxesIcon />}
              label="Загальна кількість"
              value={`${item.quantity} ${item.unit}`}
              status={item.needsRefill ? "Потребує поповнення" : "Достатньо"}
              statusVariant={item.needsRefill ? "warning" : "success"}
            />

            <AvailabilityItem
              icon={<MinusCircleIcon />}
              label="Мінімальний залишок"
              value={`${item.minimum_quantity} ${item.unit}`}
            />

            <AvailabilityItem
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
              <span className="text-[12px] text-slate-400">
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
                          <span className="block text-[12px] text-slate-400">
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
                          <span className="block text-[12px] text-slate-400">
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

                    {isNearest && (
                      <div className="mt-2">
                        <span className="inline-flex rounded-md bg-white px-2 py-1 text-[10px] font-medium text-blue-600">
                          Найближча партія
                        </span>
                      </div>
                    )}
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

type InfoItemProps = {
  label: string;
  value: string | null | undefined;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="min-w-0">
      <span className="block text-[12px] text-slate-400">{label}</span>

      <span className="mt-1 block truncate text-[13px] font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
};

export default MedicineDetailsModal;
