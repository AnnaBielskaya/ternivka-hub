import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const FormSection = ({ title, description, children }: FormSectionProps) => {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      {children}
    </section>
  );
};

export default FormSection;
