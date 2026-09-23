import {
  CalendarIcon,
  ChartPieIcon,
  CurrencyEuroIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ChartBarSquareIcon } from "@heroicons/react/24/solid";
import FeatureListItem from "../FeatureListItem";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";

function AdminStudentNoStudentSelected() {
  const { openStudentSearch } = useStudentsCtx();
  return (
    <div className="flex flex-col   h-full gap-4 lg:flex-row">
      <div
        className="flex flex-1 flex-col p-8 gap-4 items-center justify-center h-full border
      border-borderDividers rounded-lg bg-cardBG text-primaryText"
      >
        <div className="relative flex size-32 items-center justify-center rounded-full border border-dashed border-borderDividers bg-cardBG">
          <UserGroupIcon className="size-16 text-secondaryText" />

          <div className="absolute -bottom-1 -right-1 flex size-12 items-center justify-center rounded-full bg-primary/90">
            <MagnifyingGlassIcon className="size-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-primaryText text-xl font-semibold">
            No student selected
          </span>
          <span className="text-secondaryText">
            Search and select a student to view their statistics and activity
          </span>
        </div>
        <button
          onClick={openStudentSearch}
          className="flex flex-row items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primaryText "
        >
          <UserIcon className="size-5 text-primaryText" />
          <span>Select student</span>
        </button>
      </div>
      <div className="flex flex-col lg:w-90 lg:shrink-0 gap-4 border border-borderDividers rounded-lg bg-cardBG p-5 md:p-6 text-primaryText">
        <h1 className="text-2xl font-semibold">What you can do</h1>
        <FeatureListItem
          heading="View detailed statistics"
          subheading="Analyze performance and acitvity"
          icon={ChartBarSquareIcon}
        />
        <FeatureListItem
          heading="Track shifts and requests"
          subheading="Review worked shifts and shift requests"
          icon={CalendarIcon}
        />
        <FeatureListItem
          heading="Monitor earnings"
          subheading="Check earnings and payments"
          icon={CurrencyEuroIcon}
        />
        <FeatureListItem
          heading="Compare performance"
          subheading="Track progress over time"
          icon={ChartPieIcon}
        />
      </div>
    </div>
  );
}

export default AdminStudentNoStudentSelected;
