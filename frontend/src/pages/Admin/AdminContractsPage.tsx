import AdminContractsPageContent from "../../components/Admin/AdminContracts/AdminContractsPageContent";
import PageHeading from "../../components/PageHeading";

function AdminContractsPage() {
  return (
    <div className="text-xl text-primaryText">
      <PageHeading
        heading="Contracts"
        subheading="See students contracts for a given month"
      />
      <AdminContractsPageContent />
    </div>
  );
}

export default AdminContractsPage;
