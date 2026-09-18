"use client";

import type { InventoryItem, StockRow } from "@/features/inventory/types";

type MedicineDetailsModalProps = {
  item: InventoryItem;
  stock: StockRow[];
  onClose: () => void;
};

const formatExpiry = (month: number, year: number) => {
  return `${String(month).padStart(2, "0")}/${year}`;
};

const MedicineDetailsModal = ({
  item,
  stock,
  onClose,
}: MedicineDetailsModalProps) => {
  const isRefillRequired = item.refill_required;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="medicine-details-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="medicine-details-title"
                className="text-xl font-semibold text-gray-900"
              >
                {item.name}
              </h2>

              {isRefillRequired && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  <span className="text-[10px] leading-none">⚠️</span>
                  Треба поповнити
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {item.medicine_form && <span>{item.medicine_form.name}</span>}

              {item.medicine_form && item.medicine_purpose && (
                <span className="text-gray-300">•</span>
              )}

              {item.medicine_purpose && (
                <span>{item.medicine_purpose.name}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Закрити"
          >
            ×
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* Основна інформація */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Основна інформація
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <InfoItem label="Діюча речовина" value={item.active_ingredient} />

              <InfoItem
                label="Форма випуску"
                value={item.medicine_form?.name}
              />

              <InfoItem
                label="Призначення"
                value={item.medicine_purpose?.name}
              />

              <InfoItem label="Дозування" value={item.dosage} />

              <InfoItem label="Обʼєм" value={item.volume} />

              <InfoItem label="Одиниця обліку" value={item.unit} />
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Залишок */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Залишок</h3>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <span className="block text-xs text-gray-500">
                  Загальна кількість
                </span>

                <span className="mt-1 block text-lg font-semibold text-gray-900">
                  {item.quantity}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {item.unit}
                  </span>
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <span className="block text-xs text-gray-500">
                  Найближчий строк
                </span>

                <span className="mt-1 block text-lg font-semibold text-gray-900">
                  {item.nearestExpiry ?? "—"}
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <span className="block text-xs text-gray-500">Статус</span>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.isLow
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {item.isLow ? "Мало" : "Достатньо"}
                </span>
              </div>
            </div>

            {/* Stock */}
            <div>
              <h4 className="mb-3 text-xs font-medium text-gray-500">
                Партії за терміном придатності
              </h4>

              {stock.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">
                          Термін придатності
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Кількість
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {stock.map((stockItem) => (
                        <tr
                          key={stockItem.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-3 text-gray-700">
                            {formatExpiry(
                              stockItem.expiry_month,
                              stockItem.expiry_year
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {stockItem.quantity} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  Інформація про партії відсутня
                </div>
              )}
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Поповнення */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Поповнення
              </h3>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Потребує поповнення
                </span>

                <span className="mt-0.5 block text-xs text-gray-400">
                  Ручна відмітка
                </span>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  isRefillRequired
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isRefillRequired ? "Так" : "Ні"}
              </span>
            </div>
          </section>

          {/* Опис */}
          {item.description && (
            <>
              <div className="border-t border-gray-100" />

              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Опис</h3>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

type InfoItemProps = {
  label: string;
  value: string | null | undefined;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>

      <span className="mt-1 block text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
};

export default MedicineDetailsModal;
