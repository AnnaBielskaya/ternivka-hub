"use client";

type MedsToolbarProps = {
  refillOnly: boolean;
  onRefillChange: (value: boolean) => void;
};

const MedsToolbar = ({
  refillOnly,
  onRefillChange,
}: MedsToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">
          Сортувати:
        </span>

        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Назва
          <span className="text-xs text-gray-400">↑</span>
        </button>

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Діюча речовина
        </button>

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Строк придатності
        </button>

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Статус
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <input
            type="checkbox"
            checked={refillOnly}
            onChange={(event) =>
              onRefillChange(event.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300"
          />

          <span>Потребує поповнення</span>
        </label>

        <select
          defaultValue=""
          className="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:bg-gray-50 focus:border-gray-400"
        >
          <option value="">Усі категорії</option>
          <option value="painkillers">Знеболювальні</option>
          <option value="antibiotics">Антибіотики</option>
          <option value="infusions">Інфузійні розчини</option>
          <option value="other">Інше</option>
        </select>
      </div>
    </div>
  );
};

export default MedsToolbar;