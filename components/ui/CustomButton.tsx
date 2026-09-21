import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "dangerOutline"
  | "close";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gray-800 text-white hover:bg-gray-700",
  secondary: "border border-gray-200 text-slate-600 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  dangerOutline:
    "border border-red-500/25 bg-transparent text-red-600/70 hover:border-red-500/50 hover:bg-red-50 hover:text-red-600",
  close:
    "ml-4 h-8 w-8 shrink-0 rounded-lg p-0 text-xl font-normal text-gray-400 hover:bg-gray-100 hover:text-gray-700",
};

const CustomButton = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const baseClassName =
    variant === "close"
      ? "inline-flex cursor-pointer items-center justify-center transition"
      : "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-xs font-semibold transition";

  return (
    <button
      type={type}
      className={`${baseClassName} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export default CustomButton;
