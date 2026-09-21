export const MEDICINE_TABLE_COLUMNS = [
  { key: "name", label: "Назва" },
  { key: "form", label: "Форма випуску" },
  { key: "active_ingredient", label: "Діюча речовина" },
  { key: "dosage", label: "Дозування" },
  { key: "volume", label: "Об'єм" },
  { key: "quantity", label: "Залишок" },
  { key: "nearestExpiry", label: "Найближчий строк" },
  { key: "status", label: "Статус" },
] as const;

export const INVENTORY_UNITS = [
  {
    value: "блістер",
    label: "Блістер",
  },
  {
    value: "упаковка",
    label: "Упаковка",
  },
  {
    value: "ампули",
    label: "Ампули",
  },
  {
    value: "грам",
    label: "Грам",
  },
  {
    value: "штука",
    label: "Штука",
  },
] as const;

export const MEDICINE_UNITS_BY_FORM = {
  Таблетки: ["блістер", "упаковка"],
  Мазь: ["штука"],
  Краплі: ["штука"],
  Розчин: ["ампули"],
  Саше: ["штука", "упаковка"],
  Інше: ["штука", "упаковка"],
} as const;

export const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export const INPUT_CLASS_NAME =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50";

export const SELECT_CLASS_NAME =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50";

export const LABEL_CLASS_NAME =
  "mb-1.5 block text-sm font-medium text-gray-700";
