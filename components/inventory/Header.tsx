import MedicineIcon from "./MedicineIcon";

const PAGE_HEADERS = {
  medicine: {
    title: "Медицина",
    subtitle:
      "Перелік медикаментів у наявності. Зверніть увагу на медикаменти, які потребують поповнення.",
  },

  supplies: {
    title: "Медичні розхідники",
    subtitle: "Шось буде",
  },

  equipment: {
    title: "Медичне обладнанна",
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
      <div className="flex flex-row items-center gap-2 mb-1">
        <MedicineIcon />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default Header;
