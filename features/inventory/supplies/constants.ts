export const SUPPLIES_TABLE_COLUMNS = [
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
