import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import ContactField, { type ContactFieldName } from "./ContactField";
import SettingsCardHeader from "../SettingsCardHeader";

function ContactInfoCard() {
  const { currentUser } = useAuthContext();
  // only one field can be edited at a time
  const [editingField, setEditingField] = useState<ContactFieldName | null>(
    null,
  );

  if (!currentUser) return null;

  function closeField(field: ContactFieldName) {
    setEditingField((current) => (current === field ? null : current));
  }

  return (
    <section
      aria-labelledby="contact-heading"
      className="rounded-xl border border-borderDividers bg-cardBG p-5"
    >
      <SettingsCardHeader
        id="contact-heading"
        icon={EnvelopeIcon}
        title="Contact details"
        subtitle="Keep these current so your admin can reach you."
      />
      <div className="mt-2 divide-y divide-borderDividers">
        <ContactField
          field="email"
          label="Email address"
          description="Password reset links and contract reminders are sent here."
          type="email"
          placeholder="name@example.com"
          emptyText="No email added"
          value={currentUser.email}
          isEditing={editingField === "email"}
          onEdit={() => setEditingField("email")}
          onClose={() => closeField("email")}
        />
        <ContactField
          field="phone"
          label="Phone number"
          description="So your admin can call you about shift changes."
          type="tel"
          placeholder="+385 91 234 5678"
          emptyText="No phone number added"
          value={currentUser.phone}
          isEditing={editingField === "phone"}
          onEdit={() => setEditingField("phone")}
          onClose={() => closeField("phone")}
        />
      </div>
    </section>
  );
}

export default ContactInfoCard;
