import type { SupplyUnit } from "./constants";

export type SupplyCategory = {
  id: string;
  name: string;
  slug: string;
};

export type SupplyCreator = {
  id: string;
  name: string;
};

export type SupplyItem = {
  id: string;
  name: string;
  quantity: number;
  unit: SupplyUnit;
  minimum_quantity: number;
  comment: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  category: SupplyCategory;
  creator: SupplyCreator | null;
};

export type SupplySortKey =
  | "name"
  | "category"
  | "unit"
  | "quantity"
  | "minimum_quantity"
  | "created_by";
