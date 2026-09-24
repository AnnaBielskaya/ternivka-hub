"use client";

import type { MedicineAuditLog } from "@/features/inventory/medicine/actions/get-medicine-audit-logs";

type MedicineAuditTableProps = {
  logs: MedicineAuditLog[];
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getActionLabel = (action: MedicineAuditLog["action"]) => {
  switch (action) {
    case "INSERT":
      return "Додавання";
    case "UPDATE":
      return "Зміна";
    case "DELETE":
      return "Видалення";
  }
};

const getActionClassName = (action: MedicineAuditLog["action"]) => {
  switch (action) {
    case "INSERT":
      return "bg-emerald-50 text-emerald-600";
    case "UPDATE":
      return "bg-blue-50 text-blue-600";
    case "DELETE":
      return "bg-red-50 text-red-600";
  }
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

const getMedicineChanges = (log: MedicineAuditLog) => {
  const oldData = log.old_data ?? {};
  const newData = log.new_data ?? {};

  if (log.action === "INSERT") {
    return "Препарат додано";
  }

  if (log.action === "DELETE") {
    return "Препарат видалено";
  }

  const changes: string[] = [];

  const fields = [
    ["Назва", "name"],
    ["Діюча речовина", "active_ingredient"],
    ["Дозування", "dosage"],
    ["Обʼєм", "volume"],
    ["Одиниця", "unit"],
    ["Опис", "description"],
    ["Мінімальний залишок", "minimum_quantity"],
  ] as const;

  for (const [label, field] of fields) {
    const oldValue = formatValue(oldData[field]);
    const newValue = formatValue(newData[field]);

    if (oldValue !== newValue) {
      changes.push(`${label}: ${oldValue} → ${newValue}`);
    }
  }

  if (oldData.form_id !== newData.form_id) {
    changes.push("Форма випуску змінена");
  }

  if (oldData.purpose_id !== newData.purpose_id) {
    changes.push("Призначення змінене");
  }

  return changes.length > 0 ? changes.join("; ") : "Дані змінено";
};

const getStockChanges = (log: MedicineAuditLog) => {
  const oldData = log.old_data ?? {};
  const newData = log.new_data ?? {};

  if (log.action === "INSERT") {
    return `Партію ${formatValue(newData.expiry_month)}/${formatValue(
      newData.expiry_year
    )} додано, кількість: ${formatValue(newData.quantity)}`;
  }

  if (log.action === "DELETE") {
    return `Партію ${formatValue(oldData.expiry_month)}/${formatValue(
      oldData.expiry_year
    )} видалено`;
  }

  const changes: string[] = [];

  if (oldData.quantity !== newData.quantity) {
    changes.push(
      `Кількість: ${formatValue(oldData.quantity)} → ${formatValue(
        newData.quantity
      )}`
    );
  }

  if (
    oldData.expiry_month !== newData.expiry_month ||
    oldData.expiry_year !== newData.expiry_year
  ) {
    changes.push(
      `Термін: ${formatValue(oldData.expiry_month)}/${formatValue(
        oldData.expiry_year
      )} → ${formatValue(newData.expiry_month)}/${formatValue(
        newData.expiry_year
      )}`
    );
  }

  return changes.length > 0 ? changes.join("; ") : "Партію змінено";
};

const MedicineAuditTable = ({ logs }: MedicineAuditTableProps) => {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
        Історія змін відсутня
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2.5 sm:hidden">
        {logs.map((log) => {
          const changes =
            log.entity_type === "stock"
              ? getStockChanges(log)
              : getMedicineChanges(log);

          return (
            <div key={log.id} className="rounded-lg bg-slate-50 px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">
                    {formatDate(log.created_at)}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {log.user_name ?? "—"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium ${getActionClassName(
                    log.action
                  )}`}
                >
                  {getActionLabel(log.action)}
                </span>
              </div>

              <div className="mt-3 border-t border-slate-200/70 pt-3">
                <span className="block text-[10px] font-medium text-slate-400">
                  Зміни
                </span>

                <p className="mt-1 break-words text-[11px] leading-4 text-slate-600">
                  {changes}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-100 sm:block">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50">
              <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500">
                Дата
              </th>

              <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500">
                Дія
              </th>

              <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500">
                Зміни
              </th>

              <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500">
                Користувач
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => {
              const changes =
                log.entity_type === "stock"
                  ? getStockChanges(log)
                  : getMedicineChanges(log);

              return (
                <tr key={log.id} className="bg-white">
                  <td className="border-b border-slate-100 px-3 py-3 align-top text-[11px] text-slate-400">
                    {formatDate(log.created_at)}
                  </td>

                  <td className="border-b border-slate-100 px-3 py-3 align-top">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${getActionClassName(
                        log.action
                      )}`}
                    >
                      {getActionLabel(log.action)}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-3 py-3 align-top">
                    <span className="text-[11px] leading-4 text-slate-600">
                      {changes}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-3 py-3 align-top">
                    <span className="text-[11px] text-slate-400">
                      {log.user_name ?? "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MedicineAuditTable;
