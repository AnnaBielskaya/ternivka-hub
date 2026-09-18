/**
 * Medicine form row
 */
export type MedicineFormRow = {
  id: string;
  name: string;
};

/**
 * Medicine purpose row
 */
export type MedicinePurposeRow = {
  id: string;
  name: string;
};

/**
 * Stock row
 */
export type StockRow = {
  id: string;
  expiry_month: number;
  expiry_year: number;
  quantity: number;
};

/**
 * Raw medicine item returned from Supabase
 */
export type MedicalItemRow = {
  id: string;
  name: string;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  refill_required: boolean;
  minimum_quantity: number;

  medicine_form: MedicineFormRow | null;
  medicine_purpose: MedicinePurposeRow | null;

  stock: StockRow[];
};

/**
 * Medicine item used by the UI
 */
export type InventoryItem = {
  id: string;
  name: string;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  refill_required: boolean;
  quantity: number;

  medicine_form: MedicineFormRow | null;
  medicine_purpose: MedicinePurposeRow | null;

  nearestExpiry: string | null;
  nearestExpirySortKey: number | null;
  isLow: boolean;
};

/**
 * Medicine table sorting
 */
export type MedicineSortKey =
  | "name"
  | "active_ingredient"
  | "nearestExpiry"
  | "status";

export type SortDirection = "asc" | "desc";
