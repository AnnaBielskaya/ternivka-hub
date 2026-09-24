import type { InventoryItem, MedicalItemRow } from "@/features/inventory/types";

function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, "0")}/${year}`;
}

export function mapInventoryItem(item: MedicalItemRow): InventoryItem {
  const quantity = item.stock.reduce(
    (total, stock) => total + Number(stock.quantity),
    0
  );

  const activeStock = item.stock
    .filter((stock) => Number(stock.quantity) > 0)
    .sort((a, b) => {
      const dateA = a.expiry_year * 100 + a.expiry_month;

      const dateB = b.expiry_year * 100 + b.expiry_month;

      return dateA - dateB;
    });

  const nearestStock = activeStock[0] ?? null;

  const nearestExpiry = nearestStock
    ? formatExpiry(nearestStock.expiry_month, nearestStock.expiry_year)
    : null;

  const nearestExpirySortKey = nearestStock
    ? nearestStock.expiry_year * 100 + nearestStock.expiry_month
    : null;

  const minimumQuantity = Number(item.minimum_quantity);

  return {
    id: item.id,
    name: item.name,
    description: item.description ?? null,
    dosage: item.dosage,
    active_ingredient: item.active_ingredient || null,
    volume: item.volume,
    unit: item.unit,
    quantity,
    minimum_quantity: minimumQuantity,
    medicine_form: item.medicine_form,
    medicine_purpose: item.medicine_purpose,
    nearestExpiry,
    nearestExpirySortKey,
    needsRefill: quantity < minimumQuantity,
    stock: item.stock,
  };
}
