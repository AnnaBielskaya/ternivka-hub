"use client";

import { useMemo, useState, useTransition } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import AvailabilityItem from "./AvailabilityItem";
import AddStockBatchForm from "./AddStockBatchForm";
import StockBatchCard from "./StockBatchCard";

import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
import BoxesIcon from "@/components/inventory/icons/BoxesIcon";
import MinusCircleIcon from "@/components/inventory/icons/MinusCircleIcon";

import SectionDivider from "@/components/ui/SectionDivider";
import SectionTitle from "@/components/ui/SectionTitle";

import type { InventoryItem, StockRow } from "@/features/inventory/types";

import { updateStockQuantity } from "@/features/inventory/actions/update-stock-quantity";

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
  const [localStock, setLocalStock] = useState<StockRow[]>(stock);

  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  const medicineSubtitle = [item.medicine_form?.name, item.dosage, item.volume]
    .filter(Boolean)
    .join(" · ");

  const sortedStock = useMemo(
    () =>
      [...localStock].sort(
        (a, b) =>
          a.expiry_year * 100 +
          a.expiry_month -
          (b.expiry_year * 100 + b.expiry_month)
      ),
    [localStock]
  );

  const totalQuantity = useMemo(
    () =>
      localStock.reduce(
        (total, stockItem) => total + Number(stockItem.quantity),
        0
      ),
    [localStock]
  );

  const nearestStock = useMemo(
    () =>
      [...localStock]
        .filter((stockItem) => Number(stockItem.quantity) > 0)
        .sort(
          (a, b) =>
            a.expiry_year * 100 +
            a.expiry_month -
            (b.expiry_year * 100 + b.expiry_month)
        )[0] ?? null,
    [localStock]
  );

  const nearestExpiry = nearestStock
    ? formatExpiry(nearestStock.expiry_month, nearestStock.expiry_year)
    : null;

  const needsRefill = totalQuantity < item.minimum_quantity;

  const handleChangeQuantity = (stockItem: StockRow, delta: number) => {
    const currentQuantity = Number(stockItem.quantity);

    const nextQuantity = Math.max(0, currentQuantity + delta);

    if (nextQuantity === currentQuantity || updatingStockId) {
      return;
    }

    setUpdatingStockId(stockItem.id);

    startTransition(async () => {
      const result = await updateStockQuantity(stockItem.id, nextQuantity);

      if (result.status === "success" && result.stock) {
        setLocalStock((current) =>
          current.map((currentStock) =>
            currentStock.id === result.stock?.id ? result.stock : currentStock
          )
        );
      } else if (result.status === "error") {
        window.alert(result.message);
      }

      setUpdatingStockId(null);
    });
  };

  const handleBatchSaved = (updatedStock: StockRow) => {
    setLocalStock((current) => {
      const exists = current.some(
        (currentStock) => currentStock.id === updatedStock.id
      );

      if (exists) {
        return current.map((currentStock) =>
          currentStock.id === updatedStock.id ? updatedStock : currentStock
        );
      }

      return [...current, updatedStock];
    });
  };

  return (
    <>
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
          <div className="flex items-center justify-between gap-2">
            {onDelete ? (
              <CustomButton variant="dangerOutline" onClick={onDelete}>
                Видалити
              </CustomButton>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <CustomButton variant="secondary" onClick={onClose}>
                Закрити
              </CustomButton>

              {onEdit && (
                <CustomButton onClick={onEdit}>Редагувати</CustomButton>
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
                value={`${totalQuantity} ${item.unit}`}
                status={needsRefill ? "Потребує поповнення" : "Достатньо"}
                statusVariant={needsRefill ? "warning" : "success"}
              />

              <AvailabilityItem
                icon={<MinusCircleIcon />}
                label="Мінімальний залишок"
                value={`${item.minimum_quantity} ${item.unit}`}
              />

              <AvailabilityItem
                icon={<CalendarIcon />}
                label="Найближчий термін придатності"
                value={nearestExpiry ?? "—"}
              />
            </div>
          </section>

          <SectionDivider />

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <SectionTitle title="Партії" className="mb-0" />

                {sortedStock.length > 0 && (
                  <span className="text-[11px] text-slate-400">
                    {sortedStock.length}{" "}
                    {sortedStock.length === 1 ? "партія" : "партії"}
                  </span>
                )}
              </div>

              <CustomButton
                type="button"
                onClick={() => setIsAddBatchOpen((current) => !current)}
              >
                + Додати партію
              </CustomButton>
            </div>

            {isAddBatchOpen && (
              <AddStockBatchForm
                itemId={item.id}
                unit={item.unit}
                onCancel={() => setIsAddBatchOpen(false)}
                onSaved={handleBatchSaved}
              />
            )}

            <div className={isAddBatchOpen ? "mt-2.5" : ""}>
              {sortedStock.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {sortedStock.map((stockItem, index) => (
                    <StockBatchCard
                      key={stockItem.id}
                      stock={stockItem}
                      unit={item.unit}
                      isNearest={index === 0}
                      isUpdating={isPending && updatingStockId === stockItem.id}
                      onChangeQuantity={handleChangeQuantity}
                    />
                  ))}
                </div>
              ) : (
                !isAddBatchOpen && (
                  <div className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                    Інформація про партії відсутня
                  </div>
                )
              )}
            </div>
          </section>

          <SectionDivider />

          <section>
            <SectionTitle title="Характеристики" />

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
        </div>
      </Modal>
    </>
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
