import type {
  MedicalItemRow,
  InventoryItem,
} from "@/features/inventory/types";

function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, "0")}/${year}`;
}

export function mapInventoryItem(
  item: MedicalItemRow,
): InventoryItem {
  const quantity = item.stock.reduce(
    (total, stock) => total + Number(stock.quantity),
    0,
  );

  const activeStock = [...item.stock]
    .filter((stock) => Number(stock.quantity) > 0)
    .sort((a, b) => {
      const dateA = a.expiry_year * 100 + a.expiry_month;
      const dateB = b.expiry_year * 100 + b.expiry_month;

      return dateA - dateB;
    });

  const nearestExpiry =
    activeStock.length > 0
      ? formatExpiry(
          activeStock[0].expiry_month,
          activeStock[0].expiry_year,
        )
      : null;

  return {
    id: item.id,
    name: item.name,
    category: item.categories[0] ?? null,
    dosage: item.dosage,
    active_ingredient: item.active_ingredient || null,
    volume: item.volume,
    unit: item.unit,
    refill_required: item.refill_required,
    quantity,
    nearestExpiry,
    isLow: quantity < Number(item.minimum_quantity),
  };
}