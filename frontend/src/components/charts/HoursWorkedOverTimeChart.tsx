import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetStatsForShiftsUserHasWorked } from "../../hooks/useGetStatsForShiftsUserHasWorked";
import { getYear } from "date-fns";
import LoadingSpinner from "../LoadingSpinner";
import NoDataYet from "../NoDataYet";

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

function HoursWorkedOverTimeChart() {
  const { userId } = useParams();

  const stats = useGetStatsForShiftsUserHasWorked(userId!);

  if (stats.status === "loading") {
    return (
      <div className="md:col-span-2 flex h-72 flex-col items-center justify-center rounded-lg border border-borderDividers bg-cardBG p-4">
        <LoadingSpinner size={82} />
      </div>
    );
  }

  if (stats.status === "error") {
    return (
      <div className="md:col-span-2 flex h-72 flex-col items-center justify-center rounded-lg border border-borderDividers bg-cardBG p-4">
        <p className="text-primaryText">Error loading data</p>
      </div>
    );
  }

  const currentYear = getYear(new Date());
  const graphData = stats.data.byMonth[currentYear];

  return (
    <div className="md:col-span-2 flex h-72 flex-col rounded-lg border border-borderDividers bg-cardBG p-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="font-semibold text-primaryText">
          Hours worked over time
        </h2>

        <p className="text-sm text-secondaryText">
          Total hours worked each month this year
        </p>
      </div>

      {Object.keys(stats.data.byMonth).length === 0 ? (
        <NoDataYet />
      ) : (
        <div className="min-h-0 flex-1">
          {/* Chart */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="#252a2d" />

              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7075", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{ fill: "#6b7075", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}h`}
              />

              <Tooltip
                cursor={{ stroke: "#2a2e34" }}
                content={<CustomTooltip />}
              />

              <Line
                type="monotone"
                dataKey="hours"
                stroke="#ff5f00"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#ff5f00",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "#ff5f00",
                  stroke: "#e5e7ea",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default HoursWorkedOverTimeChart;
