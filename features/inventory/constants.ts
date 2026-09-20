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
