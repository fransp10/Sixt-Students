import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import CreateStudentInput from "../../CreateStudentInput";
import { useState } from "react";
import { generateUsername } from "../../../helpers/generateUsername";
import FirstTimeSignInOptionButton from "./FirstTimeSignInOptionButton";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
type CreateStudentModalProps = {
  handleCloseModal: () => void;
};

function CreateStudentModal({ handleCloseModal }: CreateStudentModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date>();
  const [hourlyRate, setHourlyRate] = useState("");
  const [firstSignInOption, setFirstSignInOption] = useState<
    "email" | "tempPassword" | null
  >(null);
  const username = generateUsername(firstName, lastName);

  return createPortal(
    <div className="fixed flex items-center justify-center inset-0 bg-black/60">
      <div className="w-lg bg-cardBG p-4 border border-borderDividers rounded-lg text-primaryText relative">
        <div className="overflow-y-auto scrollbar-thin">
          <h1 className="text-xl font-semibold">Add a student</h1>
          <h2 className="text-sm font-semibold text-secondaryText">
            They can request shifts as soon as they sign in.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <CreateStudentInput
              label="First name"
              placeholder="Fran"
              value={firstName}
              setter={setFirstName}
            />
            <CreateStudentInput
              label="Last name"
              placeholder="Sipek"
              value={lastName}
              setter={setLastName}
            />

            <CreateStudentInput
              label="Hourly rate"
              placeholder="8.56"
              value={hourlyRate}
              setter={setHourlyRate}
            />
            <CreateStudentInput
              label="Email (optional)"
              style={"col-span-full"}
              placeholder="fran.sipek@example.com"
              value={email}
              setter={setEmail}
            />
          </div>
          <div className="text-xs font-semibold mt-2">
            <span className="text-secondaryText">Username: </span>
            <span className="text-primaryText">{username}</span>
          </div>
          <h2 className="text-sm font-semibold mt-2">First sign-in option</h2>
          <div className="flex flex-col md:flex-row gap-2 col-span-full mt-2">
            <FirstTimeSignInOptionButton
              label="Email setup link"
              onSelect={() => setFirstSignInOption("email")}
              selected={firstSignInOption === "email"}
              disabled={firstSignInOption === "email"}
            />
            <FirstTimeSignInOptionButton
              label="Temporary password"
              onSelect={() => setFirstSignInOption("tempPassword")}
              selected={firstSignInOption === "tempPassword"}
              disabled={firstSignInOption === "tempPassword"}
            />
          </div>
          <button className="w-full mt-4 rounded-lg p-4 bg-primary cursor-pointer hover:bg-primary/80">
            Create new user
          </button>

          {/* CLOSE MODAL BUTTON */}
          <button
            className="absolute right-3 top-3  bg-cardLighterBG text-surfaceCards rounded-lg  transition-colors cursor-pointer hover:text-danger"
            onClick={handleCloseModal}
          >
            <XMarkIcon className="size-8 p-2" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CreateStudentModal;
