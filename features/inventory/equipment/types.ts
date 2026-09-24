export type EquipmentStatus = "working" | "not_working" | "incomplete";

export type EquipmentPowerSource = "mains" | "autonomous" | "both";

export type EquipmentItem = {
  id: string;
  name: string;
  status: EquipmentStatus;
  power_source: EquipmentPowerSource;
  quantity: number;
  comment: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
  } | null;
};
