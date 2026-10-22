import AdminContractsTable from "./AdminContractsTable";
import ContractsStatsCards from "./ContractsStatsCards";

function AdminContractsPageContent() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      <ContractsStatsCards />
      <AdminContractsTable />
    </div>
  );
}

export default AdminContractsPageContent;
