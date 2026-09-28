"use client";

import Modal from "@/components/ui/Modal";
import SectionDivider from "@/components/ui/SectionDivider";
import SectionTitle from "@/components/ui/SectionTitle";
import StatusBadge from "@/components/ui/StatusBadge";

import BoxesIcon from "@/components/inventory/icons/BoxesIcon";
import MinusCircleIcon from "@/components/inventory/icons/MinusCircleIcon";

import AvailabilityItem from "@/features/inventory/medicine/components/AvailabilityItem";

import { SUPPLY_UNIT_LABELS } from "../constants";
import type { SupplyItem } from "../types";

type SupplyDetailsModalProps = {
  item: SupplyItem;
  onClose: () => void;
};

const SupplyDetailsModal = ({ item, onClose }: SupplyDetailsModalProps) => {
  const needsRefill = item.quantity <= item.minimum_quantity;
  const unit = SUPPLY_UNIT_LABELS[item.unit];

  return (
    <Modal
      isOpen={true}
      title={
        <div className="min-w-0">
          <h2 className="min-w-0 text-lg font-semibold leading-tight text-slate-900">
            {item.name}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.category ? (
              <StatusBadge
                kind="category"
                variant="info"
                title={item.category.name}
              />
            ) : null}

            <StatusBadge
              variant={needsRefill ? "warning" : "success"}
              title={needsRefill ? "Потребує поповнення" : "Достатньо"}
            />
          </div>
        </div>
      }
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-5 p-4 sm:p-5">
        <section>
          <SectionTitle title="Наявність" />

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <AvailabilityItem
              icon={<BoxesIcon />}
              label="Загальна кількість"
              value={`${item.quantity} ${unit}`}
              status={needsRefill ? "Потребує поповнення" : "Достатньо"}
              statusVariant={needsRefill ? "warning" : "success"}
            />

            <AvailabilityItem
              icon={<MinusCircleIcon />}
              label="Мінімальний залишок"
              value={`${item.minimum_quantity} ${unit}`}
            />

            <AvailabilityItem
              icon={<BoxesIcon />}
              label="Одиниця обліку"
              value={unit}
            />
          </div>
        </section>

        <SectionDivider />

        <section>
          <SectionTitle title="Характеристики" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <InfoItem label="Назва" value={item.name} />

            <InfoItem label="Категорія" value={item.category?.name} />

            <InfoItem label="Одиниця обліку" value={unit} />

            <InfoItem label="Кількість" value={`${item.quantity} ${unit}`} />

            <InfoItem
              label="Мінімальний залишок"
              value={`${item.minimum_quantity} ${unit}`}
            />

            <InfoItem
              label="Статус"
              value={needsRefill ? "Потребує поповнення" : "Достатньо"}
            />

            <InfoItem label="Додано" value={formatDateTime(item.created_at)} />

            <InfoItem
              label="Оновлено"
              value={formatDateTime(item.updated_at)}
            />

            <InfoItem label="Додав" value={item.creator?.name} />
          </div>
        </section>

        {item.comment ? (
          <>
            <SectionDivider />

            <section>
              <SectionTitle title="Коментар" />

              <div className="rounded-lg bg-slate-50 px-3.5 py-3">
                <p className="whitespace-pre-wrap text-xs leading-5 text-slate-600">
                  {item.comment}
                </p>
              </div>
            </section>
          </>
        ) : null}
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

      <span className="mt-1 block break-words text-[13px] font-medium leading-4 text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
};

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default SupplyDetailsModal;
