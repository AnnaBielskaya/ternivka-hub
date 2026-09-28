import { SupplyUnit } from "./constants";

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
};

export type SupplySortKey = "name" | "quantity" | "created_by";
