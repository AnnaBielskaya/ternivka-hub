import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="cursor-pointer flex items-center justify-center gap-2">
      <Image
        src="/logo.svg"
        alt="Логотип"
        width={32}
        height={32}
        priority
        className="h-7 w-auto"
      />

      <div className="font-semibold">Тернівський склад</div>
    </Link>
  );
};

export default Logo;
