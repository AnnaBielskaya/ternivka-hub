const PAGE_HEADERS = {
  medicine: {
    title: "Препарати",
    subtitle: "Зверніть увагу на медикаменти, які потребують поповнення.",
  },
  supplies: {
    title: "Розхідники",
    subtitle: "Шось буде",
  },
  equipment: {
    title: "Обладнання",
    subtitle: "Шось буде",
  },
  tacmed: {
    title: "Такмед",
    subtitle: "Шось буде",
  },
};

type HeaderProps = {
  variant: keyof typeof PAGE_HEADERS;
};

const Header = ({ variant }: HeaderProps) => {
  const { title, subtitle } = PAGE_HEADERS[variant];

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};

export default Header;
