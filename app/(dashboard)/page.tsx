import MedsTable from "@/features/inventory/components/MedsTable";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-5 px-6 pt-3">
      <MedsTable />
    </main>
  );
}