const PAGE_HEADERS = {
  medicine: {
    title: "Препарати",
    subtitle: "Зверніть увагу на медикаменти, які потребують поповнення.",
  },

  supplies: {
    title: "Розхідники",
    subtitle: "Контроль запасів та наявності витратних матеріалів.",
  },

  equipment: {
    title: "Обладнання",
    subtitle: "Облік стану, кількості та доступності обладнання.",
  },

  tacmed: {
    title: "Такмед",
    subtitle: "Необхідні засоби та матеріали для тактичної медицини.",
  },

  users: {
    title: "Користувачі",
    subtitle: "Керування користувачами, ролями та доступом до системи.",
  },
};

type HeaderProps = {
  variant: keyof typeof PAGE_HEADERS;
};

const Header = ({ variant }: HeaderProps) => {
  const { title, subtitle } = PAGE_HEADERS[variant];

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};

export default Header;
