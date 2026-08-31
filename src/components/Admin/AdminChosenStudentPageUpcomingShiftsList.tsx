import UpcomingShiftListItem from "./UpcomingShiftListItem";

function AdminChosenStudentPageUpcomingShiftsList() {
  return (
    <div>
      <div className="flex flex-row justify-between items-center p-2 border-b border-borderDividers">
        <span>Upcoming shifts</span>
        <button>View all</button>
      </div>
      <div>
        <UpcomingShiftListItem />
      </div>
    </div>
  );
}

export default AdminChosenStudentPageUpcomingShiftsList;
