"use client";

type MedsToolbarProps = {
  refillOnly: boolean;
  onRefillChange: (value: boolean) => void;
};

const FORM_FILTERS = [
  "Усі форми",
  "Таблетки",
  "Капсули",
  "Ампули",
  "Розчини",
  "Мазі",
];

const MedsToolbar = ({ refillOnly, onRefillChange }: MedsToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FORM_FILTERS.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[13px] font-medium transition ${
              index === 0
                ? "bg-gray-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => onRefillChange(!refillOnly)}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition ${
            refillOnly
              ? "bg-gray-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>⚠</span>
          <span>Потребує поповнення</span>
        </button>
      </div>
    </div>
  );
};

export default MedsToolbar;
