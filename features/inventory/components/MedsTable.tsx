import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";
import type { InventoryItem } from "@/features/inventory/types";
import { MEDICINE_TABLE_COLUMNS } from "../constants";
import Header from "@/components/inventory/Header";
import MedsToolbar from "./MedsToolbar";

const MedsTable = async () => {
  const items = await getMedicalItems();

  const inventoryItems: InventoryItem[] = items.map(mapInventoryItem);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Header variant="medicine" />

        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          <span>Додати препарат</span>
        </button>
      </div>

      <MedsToolbar />

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-max w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-[#EEF2F5] text-left">
              {MEDICINE_TABLE_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 font-medium text-gray-600"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {inventoryItems.map((item) => (
              <tr
                key={item.id}
                className={`cursor-pointer border-b border-gray-100 last:border-0 transition ${
                  item.refill_required
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-5 py-4 font-medium text-gray-900">
                  <div className="flex flex-row items-center gap-2">
                    <p
                      className={`${
                        item.refill_required ? "text-red-700 font-semibold" : ""
                      }`}
                    >
                      {item.name}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 font-medium text-gray-900">
                  {item.category?.name || "-"}
                </td>

                <td className="px-5 py-4 font-medium text-gray-900">
                  {item.active_ingredient || "-"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {item.dosage || "-"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {item.volume || "-"}
                </td>

                <td className="px-5 py-4 text-gray-600">{item.unit}</td>

                <td
                  className={`px-5 py-4 font-medium text-gray-900 text-xs ${
                    item.refill_required ? "text-red-700 font-semibold" : ""
                  }`}
                >
                  {item.quantity}
                </td>

                <td className="px-5 py-4 text-gray-600 text-xs">
                  {item.nearestExpiry || "-"}
                </td>

                <td className="px-5 py-4">
                  {item.refill_required ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                      <span className="text-[10px] leading-none">⚠️</span>
                      Треба поповнити
                    </span>
                  ) : (
                    <span
                      className={
                        item.isLow
                          ? "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                          : "inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                      }
                    >
                      {item.isLow ? "Мало" : "Достатньо"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedsTable;
