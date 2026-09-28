type StatusBadgeVariant = "warning" | "success" | "info";

type StatusBadgeKind = "status" | "form" | "category";

type StatusBadgeProps = {
  title: string;
  variant: StatusBadgeVariant;
  kind?: StatusBadgeKind;
};

const VARIANT_STYLES: Record<StatusBadgeVariant, string> = {
  warning: "bg-red-100 text-red-700",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-slate-100 text-slate-500",
};

const CATEGORY_ICONS: Record<string, string> = {
  Такмед: "🩸",
  "Перев’язувальні матеріали": "🩹",
  "Інфузійні матеріали": "💧",
};

const StatusBadge = ({ title, variant, kind = "status" }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {kind === "status" && variant === "warning" && (
        <span className="text-[10px] leading-none">⚠️</span>
      )}

      {kind === "form" && title === "Таблетки" && (
        <span className="text-[9px] leading-none">💊</span>
      )}

      {kind === "category" && CATEGORY_ICONS[title] && (
        <span className="text-[10px] leading-none">
          {CATEGORY_ICONS[title]}
        </span>
      )}

      {title}
    </span>
  );
};

export default StatusBadge;
