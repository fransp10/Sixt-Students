import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import ContactField from "./ContactField";
import ContactInfoHeader from "./ContactInfoHeader";

function ContactInfoCard() {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return (
      <div>
        <h1>No user</h1>
      </div>
    );
  }

  return (
    <div className=" p-6 bg-cardBg border-borderDividers border rounded-xl text-primaryText">
      <ContactInfoHeader />
      <div className="flex flex-col gap-6 mt-4 ">
        <ContactField
          field="email"
          label="Email address"
          type="email"
          value={currentUser.email ?? ""}
        />
        <ContactField
          field="phone"
          label="Phone number"
          type="tel"
          value={currentUser.phone ?? "NO PHONE NUMBER"}
        />
      </div>
    </div>
  );
}

export default ContactInfoCard;
