import { useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetStatsForShiftsUserHasWorked } from "../../hooks/useGetStatsForShiftsUserHasWorked";
import LoadingSpinner from "../LoadingSpinner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-borderDividers bg-cardBG px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm text-secondaryText">{label}</p>
      <p className=" font-semibold text-primaryText">
        <span className="text-primary">{payload[0].value}</span>
        <span> hours worked</span>
      </p>
    </div>
  );
}

function BarChartHoursByWeekday() {
  const { userId } = useParams<{ userId: string }>();
  const stats = useGetStatsForShiftsUserHasWorked(userId!);

  console.log("Stats for shifts user has worked:", stats);
  if (stats.status === "error") {
    return (
      <div className="flex h-82 items-center justify-center rounded-xl border border-borderDividers bg-cardBG p-4">
        <p className="text-sm text-secondaryText">Error loading data</p>
      </div>
    );
  }

  if (stats.status === "loading") {
    return (
      <div className="flex h-82 items-center justify-center rounded-xl border border-borderDividers bg-cardBG p-4">
        <LoadingSpinner size={82} />
      </div>
    );
  }
  console.log("Stats data:", stats.data.byWeekday);

  return (
    <div className="flex  h-82 flex-col rounded-xl border border-borderDividers bg-cardBG p-4">
      {/* Chart heading */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primaryText">
          Hours worked by weekday
        </h2>

        <p className="mt-1 text-sm text-secondaryText">
          Total hours worked on each day of the week this month
        </p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.data.byWeekday}>
            <Label value="Hours Worked" position="top" />
            <CartesianGrid vertical={false} stroke="#1a1e21" />

            <XAxis
              dataKey="day"
              tick={{ fill: "#6b7075" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              tick={{ fill: "#6b7075" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip cursor={false} content={<CustomTooltip />} />

            <Bar
              dataKey="hours"
              fill="#ff5f00"
              minPointSize={3}
              radius={[6, 6, 0, 0]}
              label={{ position: "top", fill: "#4b4e55", fontSize: 12 }}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartHoursByWeekday;
