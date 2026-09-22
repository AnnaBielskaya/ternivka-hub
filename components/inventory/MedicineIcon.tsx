import Image from "next/image";

const MedicineIcon = () => {
  return (
    <Image
        src="/medicine.svg"
        alt="Medicine Icon"
        width={40}
        height={40}
        priority
      />
  );
};

export default MedicineIcon;
