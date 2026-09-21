import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
};

const FormField = ({
  label,
  htmlFor,
  required = false,
  children,
}: FormFieldProps) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}
    </div>
  );
};

export default FormField;
