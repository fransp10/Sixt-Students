import PageHeading from "../../components/PageHeading";
import AccountInfoCard from "../../components/student/AccountInfoCard";
import ContactInfoCard from "../../components/student/ContactInfoCard";
import SecurityCard from "../../components/student/SecurityCard";

function StudentSettingsPage() {
  return (
    <div>
      <PageHeading
        heading="Settings"
        subheading="Manage your account information and preferences."
      />
      <div className="mt-12 flex flex-col gap-6">
        <AccountInfoCard />
        {/* 2nd card */}
        <ContactInfoCard />
        {/* 3rd card */}
        {/*  */}
        <SecurityCard />
      </div>
    </div>
  );
}

export default StudentSettingsPage;
