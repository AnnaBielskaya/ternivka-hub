"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import AvailabilityItem from "./AvailabilityItem";
import AddStockBatchForm from "./AddStockBatchForm";
import StockBatchCard from "./StockBatchCard";
import MedicineAuditTable from "./MedicineAuditTable";

import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
import BoxesIcon from "@/components/inventory/icons/BoxesIcon";
import MinusCircleIcon from "@/components/inventory/icons/MinusCircleIcon";

import SectionDivider from "@/components/ui/SectionDivider";
import SectionTitle from "@/components/ui/SectionTitle";

import type { InventoryItem, StockRow } from "@/features/inventory/types";

import { updateStockQuantity } from "@/features/inventory/actions/update-stock-quantity";
import { getMedicineAuditLogs } from "@/features/inventory/actions/get-medicine-audit-logs";
import { UserRole } from "@/features/users/types";

type MedicineDetailsModalProps = {
  item: InventoryItem;
  stock: StockRow[];
  role: UserRole;
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
  role,
  onClose,
  onEdit,
  onDelete,
}: MedicineDetailsModalProps) => {
  const [localStock, setLocalStock] = useState<StockRow[]>(stock);

  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [auditLogs, setAuditLogs] = useState<
    Awaited<ReturnType<typeof getMedicineAuditLogs>>
  >([]);

  const [isAuditLoading, setIsAuditLoading] = useState(true);

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

  const loadAuditLogs = useCallback(async () => {
    const logs = await getMedicineAuditLogs(item.id);

    setAuditLogs(logs);
    setIsAuditLoading(false);
  }, [item.id]);

  useEffect(() => {
    setIsAuditLoading(true);
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleChangeQuantity = (stockItem: StockRow, delta: number) => {
    const currentQuantity = Number(stockItem.quantity);

    const nextQuantity = Math.max(0, currentQuantity + delta);

    if (nextQuantity === currentQuantity || updatingStockId) {
      return;
    }

    setUpdatingStockId(stockItem.id);

    startTransition(async () => {
      const result = await updateStockQuantity(stockItem.id, nextQuantity);

      if (result.status === "success") {
        if (result.stock === null) {
          setLocalStock((current) =>
            current.filter((currentStock) => currentStock.id !== stockItem.id)
          );
        } else {
          setLocalStock((current) =>
            current.map((currentStock) =>
              currentStock.id === result.stock?.id ? result.stock : currentStock
            )
          );
        }

        await loadAuditLogs();
      } else {
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

    loadAuditLogs();
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    onDelete?.();
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
              <p className="mt-1 truncate text-xs text-slate-500 sm:truncate-none">
                {medicineSubtitle}
              </p>
            )}
          </div>
        }
        onClose={onClose}
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:shrink-0">
              {role === "super_admin" || (role === "admin" && onDelete) ? (
                <CustomButton
                  variant="dangerOutline"
                  onClick={handleDeleteClick}
                >
                  Видалити
                </CustomButton>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
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
        <div className="space-y-5 p-4 sm:p-5">
          <section>
            <SectionTitle title="Наявність" />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <SectionTitle title="Партії" className="mb-0" />

                {sortedStock.length > 0 && (
                  <span className="shrink-0 text-[11px] text-slate-400">
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
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <SectionDivider />

          <section>
            <SectionTitle title="Історія змін" />

            {isAuditLoading ? (
              <div className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-400">
                Завантаження історії...
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <MedicineAuditTable logs={auditLogs} />
              </div>
            )}
          </section>
        </div>
      </Modal>

      {isDeleteConfirmOpen && (
        <Modal
          isOpen={true}
          title="Видалити препарат?"
          onClose={handleCancelDelete}
          size="sm"
          footer={
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <CustomButton variant="secondary" onClick={handleCancelDelete}>
                Скасувати
              </CustomButton>

              <CustomButton variant="danger" onClick={handleConfirmDelete}>
                Видалити
              </CustomButton>
            </div>
          }
        >
          <div className="p-4 sm:p-5">
            <p className="text-sm leading-5 text-slate-600">
              Ви впевнені, що хочете видалити препарат «{item.name}»?
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Усі партії цього препарату також будуть видалені. Цю дію неможливо
              скасувати.
            </p>
          </div>
        </Modal>
      )}
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
