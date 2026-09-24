import type { EquipmentPowerSource, EquipmentStatus } from "./types";

export const EQUIPMENT_TABLE_COLUMNS = [
  {
    key: "name",
    label: "Назва",
    sortable: true,
  },
  {
    key: "status",
    label: "Стан",
    sortable: true,
  },
  {
    key: "power_source",
    label: "Живлення",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Кількість",
    sortable: true,
  },
  {
    key: "comment",
    label: "Коментар",
    sortable: false,
  },
  {
    key: "created_by",
    label: "Додав",
    sortable: true,
  },
] as const;

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  working: "Робочий",
  not_working: "Не робочий",
  incomplete: "Не комплектний",
};

export const EQUIPMENT_POWER_LABELS: Record<EquipmentPowerSource, string> = {
  mains: "Від мережі",
  autonomous: "Автономне",
  both: "Від мережі + автономне",
};

export const EQUIPMENT_STATUS_OPTIONS = [
  {
    value: "working",
    label: "Робочий",
  },
  {
    value: "not_working",
    label: "Не робочий",
  },
  {
    value: "incomplete",
    label: "Не комплектний",
  },
] as const;

export const EQUIPMENT_POWER_OPTIONS = [
  {
    value: "mains",
    label: "Від мережі",
  },
  {
    value: "autonomous",
    label: "Автономне",
  },
  {
    value: "both",
    label: "Від мережі + автономне",
  },
] as const;
