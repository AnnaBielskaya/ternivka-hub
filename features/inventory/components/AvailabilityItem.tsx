"use client";

type AvailabilityItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: string;
  statusVariant?: "warning" | "success";
};

const AvailabilityItem = ({
  icon,
  label,
  value,
  status,
  statusVariant,
}: AvailabilityItemProps) => {
  const isWarning = statusVariant === "warning";
  const isSuccess = statusVariant === "success";

  return (
    <div
      className={`min-w-0 rounded-lg px-3.5 py-3 ${
        isWarning ? "bg-red-50" : isSuccess ? "bg-emerald-50" : "bg-slate-50"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
            isWarning
              ? "bg-red-100 text-red-500"
              : isSuccess
              ? "bg-emerald-100 text-emerald-600"
              : "bg-white text-slate-400"
          }`}
        >
          {icon}
        </div>

        <span
          className={`min-w-0 text-[11px] leading-4 ${
            isWarning
              ? "text-red-500"
              : isSuccess
              ? "text-emerald-600"
              : "text-slate-400"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`min-w-0 break-words text-[13px] font-semibold leading-4 ${
            isWarning
              ? "text-red-700"
              : isSuccess
              ? "text-emerald-700"
              : "text-slate-900"
          }`}
        >
          {value}
        </span>

        {status && (
          <span
            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
              isWarning
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvailabilityItem;
