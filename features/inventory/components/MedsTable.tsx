import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";
import { MEDICINE_TABLE_COLUMNS } from "../constants";
import Header from "@/components/inventory/Header";
import MedsToolbar from "./MedsToolbar";
import AddItemButton from "./AddItemButton";

const CELL_CLASS = "px-5 py-4";
const BORDER_CELL_CLASS = `${CELL_CLASS} border-r border-gray-100`;

const MedsTable = async () => {
  const items = await getMedicalItems();
  const inventoryItems = items.map(mapInventoryItem);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Header variant="medicine" />
        <AddItemButton variant="medicine" />
      </div>

      <MedsToolbar />

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-max border-collapse text-sm">
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
            {inventoryItems.map((item) => {
              const isRefillRequired = item.refill_required;

              const cellTextClass = isRefillRequired
                ? "text-red-700"
                : "text-gray-900";

              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer border-b border-gray-100 last:border-0 transition ${
                    isRefillRequired
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`${BORDER_CELL_CLASS} font-medium ${cellTextClass} ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {item.name}
                  </td>

                  <td
                    className={`${BORDER_CELL_CLASS} font-medium ${cellTextClass} ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {item.category?.name ?? "-"}
                  </td>

                  <td
                    className={`${BORDER_CELL_CLASS} font-medium ${cellTextClass} ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {item.active_ingredient ?? "-"}
                  </td>

                  <td
                    className={`${BORDER_CELL_CLASS} ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.dosage ?? "-"}
                  </td>

                  <td
                    className={`${BORDER_CELL_CLASS} ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.volume ?? "-"}
                  </td>

                  <td
                    className={`${BORDER_CELL_CLASS} ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.unit}
                  </td>

                  <td
                    className={`${CELL_CLASS} text-xs font-medium ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-900"
                    }`}
                  >
                    {item.quantity}
                  </td>

                  <td
                    className={`${CELL_CLASS} text-xs ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.nearestExpiry ?? "-"}
                  </td>

                  <td
                    className={`${CELL_CLASS} ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {isRefillRequired ? (
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedsTable;
