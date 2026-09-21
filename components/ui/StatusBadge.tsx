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
  warning:
    "bg-red-100 text-red-700",
  success:
    "bg-green-50 text-green-600",
  info:
    "text-gray-400 bg-gray-100",
};

const StatusBadge = ({
  title,
  variant,
}: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${VARIANT_STYLES[variant]}`}
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
