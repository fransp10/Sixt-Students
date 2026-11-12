import PageHeading from "../../components/PageHeading";
import AccountInfoCard from "../../components/student/AccountInfoCard";
import ContactInfoCard from "../../components/student/ContactInfo/ContactInfoCard";
import SecurityCard from "../../components/student/SecurityCard";

function StudentSettingsPage() {
  return (
    <div>
      <PageHeading
        heading="Settings"
        subheading="Update your contact details and password."
      />
      {/* what the student can change on the left, what only the admin can change on the right */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ContactInfoCard />
          <SecurityCard />
        </div>
        <AccountInfoCard />
      </div>
    </div>
  );
}

export default StudentSettingsPage;
