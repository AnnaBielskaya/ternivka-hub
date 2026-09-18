import MedsTable from "@/features/inventory/components/MedsTable";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <MedsTable />
    </main>
  );
}