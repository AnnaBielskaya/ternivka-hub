export type MedicineFormRow = {
  id: string;
  name: string;
};

export type MedicinePurposeRow = {
  id: string;
  name: string;
};

export type StockRow = {
  id: string;
  expiry_month: number;
  expiry_year: number;
  quantity: number;
};

export type MedicalItemRow = {
  id: string;
  name: string;
  description: string | null;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  minimum_quantity: number;

  medicine_form: MedicineFormRow | null;
  medicine_purpose: MedicinePurposeRow | null;

  stock: StockRow[];
};

export type InventoryItem = {
  id: string;
  name: string;
  description: string | null;
  dosage: string | null;
  active_ingredient: string | null;
  volume: string | null;
  unit: string;
  quantity: number;
  minimum_quantity: number;
  medicine_form: MedicineFormRow | null;
  medicine_purpose: MedicinePurposeRow | null;
  nearestExpiry: string | null;
  nearestExpirySortKey: number | null;
  needsRefill: boolean;
  stock: StockRow[];
};

export type MedicineSortKey =
  | "name"
  | "active_ingredient"
  | "nearestExpiry"
  | "status";

export type SortDirection = "asc" | "desc";

export type MedicineCreateState = {
  status: "idle" | "success" | "error";
  message: string;
};
