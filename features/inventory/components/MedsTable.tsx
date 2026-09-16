import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import {
  mapInventoryItem,
  type InventoryItem,
} from "@/features/inventory/utils/map-inventory-item";

const MedsTable = async () => {
  const items = await getMedicalItems();

  const inventoryItems: InventoryItem[] =
    items.map(mapInventoryItem);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th className="px-5 py-4 font-medium text-gray-600">
              Назва
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Категорія
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Діюча речовина
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Дозування
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Об'єм
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Одиниця
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Залишок
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Найближчий строк
            </th>

            <th className="px-5 py-4 font-medium text-gray-600">
              Статус
            </th>
          </tr>
        </thead>

        <tbody>
          {inventoryItems.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td className="px-5 py-4 font-medium text-gray-900">
                {item.name}
              </td> 

              <td className="px-5 py-4 font-medium text-gray-900">
                -
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

              <td className="px-5 py-4 text-gray-600">
                {item.unit}
              </td>

              <td className="px-5 py-4 font-medium text-gray-900">
                {item.quantity}
              </td>

              <td className="px-5 py-4 text-gray-600">
                {item.nearestExpiry || "-"}
              </td>

              <td className="px-5 py-4">
                <span
                  className={
                    item.isLow
                      ? "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                      : "inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                  }
                >
                  {item.isLow
                    ? "Мало"
                    : "Достатньо"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedsTable;