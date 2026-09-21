type StatusBadgeVariant =
  | "warning"
  | "success"
  | "info";

type StatusBadgeProps = {
  title: string;
  variant: StatusBadgeVariant;
};

const VARIANT_STYLES: Record<
  StatusBadgeVariant,
  string
> = {
  warning: "bg-red-100 text-red-700",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-slate-100 text-slate-500",
};

const StatusBadge = ({
  title,
  variant,
}: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {variant === "warning" && (
        <span className="text-[10px] leading-none">
          ⚠️
        </span>
      )}

      {title}
    </span>
  );
};

export default StatusBadge;