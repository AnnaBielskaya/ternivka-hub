import Header from "@/components/ui/Header";
import AddItemButton from "@/components/ui/AddItemButton";

const Equipment = () => {
  return (
    <>
      <div className="flex items-center gap-1 justify-between">
        <Header variant="equipment" />

        <AddItemButton variant="equipment" />
      </div>
    </>
  );
};

export default Equipment;
