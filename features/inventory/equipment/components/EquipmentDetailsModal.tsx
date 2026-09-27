"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import SectionDivider from "@/components/ui/SectionDivider";
import SectionTitle from "@/components/ui/SectionTitle";
import StatusBadge from "@/components/ui/StatusBadge";

import type {
  EquipmentItem,
  EquipmentPowerSource,
  EquipmentStatus,
} from "@/features/inventory/equipment/types";

import {
  EQUIPMENT_POWER_LABELS,
  EQUIPMENT_STATUS_LABELS,
} from "@/features/inventory/equipment/constants";

import { UserRole } from "@/features/users/types";

type EquipmentDetailsModalProps = {
  item: EquipmentItem;
  role: UserRole;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const getStatusVariant = (
  status: EquipmentStatus
): "warning" | "success" | "info" => {
  switch (status) {
    case "working":
      return "success";

    case "not_working":
      return "warning";

    case "incomplete":
      return "warning";
  }
};

const getPowerVariant = (
  powerSource: EquipmentPowerSource
): "warning" | "success" | "info" => {
  switch (powerSource) {
    case "both":
      return "success";

    case "mains":
    case "autonomous":
      return "info";
  }
};

const EquipmentDetailsModal = ({
  item,
  role,
  onClose,
  onEdit,
  onDelete,
}: EquipmentDetailsModalProps) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge
                variant={getStatusVariant(item.status)}
                title={EQUIPMENT_STATUS_LABELS[item.status]}
              />

              <StatusBadge
                variant={getPowerVariant(item.power_source)}
                title={EQUIPMENT_POWER_LABELS[item.power_source]}
              />
            </div>
          </div>
        }
        onClose={onClose}
        footer={
          <div className="flex items-center justify-between gap-2">
            <div className="shrink-0">
              {role === "super_admin" || (role === "admin" && onDelete) ? (
                <CustomButton
                  variant="dangerOutline"
                  onClick={handleDeleteClick}
                >
                  Видалити
                </CustomButton>
              ) : null}
            </div>

            {onEdit && (
              <div className="shrink-0">
                <CustomButton onClick={onEdit}>Редагувати</CustomButton>
              </div>
            )}
          </div>
        }
        size="lg"
      >
        <div className="space-y-5 p-4 sm:p-5">
          <section>
            <SectionTitle title="Стан" />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoItem
                label="Статус"
                value={EQUIPMENT_STATUS_LABELS[item.status]}
              />

              <InfoItem
                label="Джерело живлення"
                value={EQUIPMENT_POWER_LABELS[item.power_source]}
              />

              <InfoItem label="Кількість" value={`${item.quantity} шт.`} />
            </div>
          </section>

          <SectionDivider />

          <section>
            <SectionTitle title="Характеристики" />

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <InfoItem label="Назва" value={item.name} />

              <InfoItem label="Кількість" value={`${item.quantity} шт.`} />

              <InfoItem
                label="Джерело живлення"
                value={EQUIPMENT_POWER_LABELS[item.power_source]}
              />

              <InfoItem
                label="Додано"
                value={formatDateTime(item.created_at)}
              />

              <InfoItem
                label="Оновлено"
                value={formatDateTime(item.updated_at)}
              />

              <InfoItem label="Додав" value={item.creator} />
            </div>
          </section>

          {item.comment && (
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
          )}
        </div>
      </Modal>

      {isDeleteConfirmOpen && (
        <Modal
          isOpen={true}
          title="Видалити обладнання?"
          onClose={handleCancelDelete}
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-2">
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
              Ви впевнені, що хочете видалити обладнання «{item.name}»?
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Цю дію неможливо скасувати.
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

export default EquipmentDetailsModal;
