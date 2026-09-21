"use client";

import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
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
  const title = (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>

      <StatusBadge
        variant={item.needsRefill ? "warning" : "success"}
        title={item.needsRefill ? "Потребує поповнення" : "Достатньо"}
      />
    </div>
  );

  const footer = (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Закрити
      </button>
    </div>
  );

  return (
    <Modal isOpen={true} title={title} onClose={onClose} footer={footer}>
      <div className="p-6">
        <section>
          <SectionTitle title="Основна інформація" />

          <div className="grid grid-cols-3 gap-x-8 gap-y-5">
            <InfoItem label="Діюча речовина" value={item.active_ingredient} />

            <InfoItem label="Форма випуску" value={item.medicine_form?.name} />

            <InfoItem label="Призначення" value={item.medicine_purpose?.name} />

            <InfoItem label="Дозування" value={item.dosage} />

            <InfoItem label="Обʼєм" value={item.volume} />

            <InfoItem label="Одиниця обліку" value={item.unit} />
          </div>
        </section>

        <SectionDivider />

        <section>
          <SectionTitle title="Залишок" />

          <div className="mb-5 grid grid-cols-3 gap-4">
            <SummaryItem
              label="Фактична кількість"
              value={`${item.quantity} ${item.unit}`}
            />

            <SummaryItem
              label="Мінімальна кількість"
              value={`${item.minimum_quantity} ${item.unit}`}
            />

            <SummaryItem
              label="Найближчий строк"
              value={item.nearestExpiry ?? "—"}
            />
          </div>

          <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-500">Статус</span>

            <div className="mt-2">
              <StatusBadge
                variant={item.needsRefill ? "warning" : "success"}
                title={item.needsRefill ? "Потребує поповнення" : "Достатньо"}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Партії
              </span>

              {stock.length > 0 && (
                <span className="text-xs text-gray-400">
                  {stock.length} {stock.length === 1 ? "партія" : "партії"}
                </span>
              )}
            </div>

            {stock.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs text-gray-500">
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
              <div className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                Інформація про партії відсутня
              </div>
            )}
          </div>
        </section>

        {item.description && (
          <>
            <SectionDivider />

            <section>
              <SectionTitle title="Опис" />

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

type SectionTitleProps = {
  title: string;
};

const SectionTitle = ({ title }: SectionTitleProps) => {
  return <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>;
};

type InfoItemProps = {
  label: string;
  value: string | null | undefined;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div>
      <span className="block text-xs text-gray-400">{label}</span>

      <span className="mt-1.5 block text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
};

type SummaryItemProps = {
  label: string;
  value: string;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <span className="block text-xs text-gray-500">{label}</span>

      <span className="mt-1.5 block text-lg font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
};

const SectionDivider = () => {
  return <div className="my-7 border-t border-gray-100" />;
};

export default MedicineDetailsModal;
