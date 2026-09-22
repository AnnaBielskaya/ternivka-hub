type SectionTitleProps = {
  title: string;
  className?: string;
};

const SectionTitle = ({ title, className = "mb-3" }: SectionTitleProps) => {
  return (
    <h3 className={`text-xs font-semibold text-slate-900 ${className}`}>
      {title}
    </h3>
  );
};

export default SectionTitle;
