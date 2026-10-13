import type { Student } from "../../types/students";
import DangerZoneModal from "./DangerZoneModal";
import { useState } from "react";
import DeactivateStudentCard from "./DeactivateStudentCard";
import ActivateStudentCard from "./ActivateStudentCard";

function DangerZoneCard({ student }: { student: Student }) {
  const [dangerZoneModalMode, setDangerZoneModalMode] = useState<
    null | "activate" | "deactivate"
  >(null);
  const isStudentActive = student.is_active;

  function handleDeactivateStudent() {
    setDangerZoneModalMode("deactivate");
  }

  function handleActivateStudent() {
    setDangerZoneModalMode("activate");
  }

  function handleCloseDangerZoneModal() {
    setDangerZoneModalMode(null);
  }
  return (
    <>
      {/* BUTTON */}
      {isStudentActive && (
        <DeactivateStudentCard
          handleDeactivateStudent={handleDeactivateStudent}
          student={student}
        />
      )}

      {!isStudentActive && (
        <ActivateStudentCard
          handleActivateStudent={handleActivateStudent}
          student={student}
        />
      )}

      {dangerZoneModalMode !== null && (
        <DangerZoneModal
          handleCloseDangerZoneModal={handleCloseDangerZoneModal}
          student={student}
          mode={dangerZoneModalMode}
        />
      )}
    </>
  );
}

export default DangerZoneCard;
