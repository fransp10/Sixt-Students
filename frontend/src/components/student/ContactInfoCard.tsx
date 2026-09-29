import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { formatPhone } from "../../helpers/formatPhoneNumber";
import { useState } from "react";

function ContactInfoCard() {
  const { currentUser } = useAuthContext();
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");

  if (!currentUser) {
    return (
      <div>
        <h1>No user</h1>
      </div>
    );
  }
  return (
    <div className="p-6 bg-cardBg border-borderDividers border rounded-xl text-primaryText">
      <div className="flex items-center gap-4">
        <div>
          <EnvelopeIcon className="size-8 sm:size-10 text-primary" />
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-semibold text-primary">
            Contact information
          </p>
          <p className="text-xs sm:text-md text-secondaryText">
            Keep your current details up to date.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 border border-borderDividers bg-cardLighterBG rounded-xl mt-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold">Email address</p>
            <p className="text-sm text-secondaryText">
              Used for important notifications about your work.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              placeholder="Enter your email"
              defaultValue={email}
              className="bg-cardBG p-2 px-4  border-borderDividers border rounded-lg
                focus:outline-none focus:border-primary"
              type="email"
            />
            <button className="py-2 px-8 bg-primary rounded-lg text-primaryText">
              <p className="text-sm font-semibold uppercase ">Update</p>
            </button>
          </div>
        </div>
        {/* Phone */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold">Phone number</p>
            <p className="text-sm text-secondaryText">
              Used if we need to contact you about your shifts.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              placeholder="Enter your phone number"
              defaultValue={phone}
              className="bg-cardBG p-2 px-4  border-borderDividers border rounded-lg
                focus:outline-none focus:border-primary"
              type="tel"
            />
            <button className="py-2 px-8 bg-primary rounded-lg text-primaryText">
              <p className="text-sm uppercase font-semibold ">Update</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoCard;
