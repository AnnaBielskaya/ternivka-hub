export type StockRow = {
  id: string;
  expiry_month: number;
  expiry_year: number;
  quantity: number;
};

export type CategoryRow = {
  id: string;
  name: string;
};

export type MedicalItemRow = {
  id: string;
  name: string;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  refill_required: boolean;
  minimum_quantity: number;
  categories: CategoryRow | null;
  stock: StockRow[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: CategoryRow | null;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  refill_required: boolean;
  quantity: number;
  nearestExpiry: string | null;
  isLow: boolean;
};

export type MedicineSortKey =
  | "name"
  | "active_ingredient"
  | "nearestExpiry"
  | "status";

export type SortDirection = "asc" | "desc";
