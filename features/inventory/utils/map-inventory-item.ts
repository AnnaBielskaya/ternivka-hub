type StockRow = {
  id: string;
  expiry_month: number;
  expiry_year: number;
  quantity: number;
};

type CategoryRow = {
  id: string;
  name: string;
};

type DatabaseItem = {
  id: string;
  name: string;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  minimum_quantity: number;
  categories: CategoryRow;
  stock: StockRow[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: CategoryRow;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  quantity: number;
  nearestExpiry: string | null;
  isLow: boolean;
};

function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, "0")}/${year}`;
}

export function mapInventoryItem(item: DatabaseItem): InventoryItem {
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

  const nearestExpiry =
    activeStock.length > 0
      ? formatExpiry(activeStock[0].expiry_month, activeStock[0].expiry_year)
      : null;

  return {
    id: item.id,
    name: item.name,
    category: item.categories,
    dosage: item.dosage,
    active_ingredient: item.active_ingredient || null,
    volume: item.volume,
    unit: item.unit,
    quantity,
    nearestExpiry,
    isLow: quantity < Number(item.minimum_quantity),
  };
}
