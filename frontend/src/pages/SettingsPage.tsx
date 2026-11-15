import PageHeading from "../components/PageHeading";
import AdminProfileCard from "../components/Admin/AdminProfileCard";
import NewStudentDefaultsCard from "../components/Admin/NewStudentDefaultsCard";
import ContactInfoCard from "../components/student/ContactInfo/ContactInfoCard";
import SecurityCard from "../components/student/SecurityCard";

function SettingsPage() {
  return (
    <div>
      <PageHeading
        heading="Settings"
        subheading="Update your contact details and password."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ContactInfoCard
            subtitle="Where password reset links are sent."
            emailDescription="Password reset links are sent here."
            phoneDescription="A number where you can be reached."
          />
          <SecurityCard usernameNote="Can't be changed" />
          <NewStudentDefaultsCard />
        </div>
        <AdminProfileCard />
      </div>
    </div>
  );
}

export default SettingsPage;
