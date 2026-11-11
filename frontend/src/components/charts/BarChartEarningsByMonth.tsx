import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useGetMyStats } from "../../hooks/useGetMyStats";

// "2026-05" -> "May"
const formatMonthName = (month: string) => format(parseISO(month), "MMMM");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-borderDividers bg-cardBG px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm text-secondaryText">
        {formatMonthName(label)}
      </p>
      <p className=" font-semibold text-primaryText">
        <span className="text-primary">{payload[0].value}€</span>
        <span> earned </span>
      </p>
    </div>
  );
}

function BarChartEarningsByMonth() {
  const { data: stats } = useGetMyStats();

  const currentYear = new Date().getFullYear();
  const currentYearData =
    stats?.byMonth.filter((m) => m.month.startsWith(`${currentYear}-`)) ?? [];

  if (currentYearData.length === 0) {
    return (
      <div className="flex flex-2 h-82 flex-col items-center justify-center rounded-xl border border-borderDividers bg-cardBG p-4">
        <p className="text-sm text-secondaryText">
          No earnings data available for this year.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-2 h-82 flex-col rounded-xl border border-borderDividers bg-cardBG p-4">
      {/* Chart heading */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primaryText">
          Earnings per month
        </h2>

        <p className="mt-1 text-sm text-secondaryText">
          Your monthly earnings this year
        </p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={currentYearData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#1a1e21" />

            <XAxis
              dataKey="month"
              tickFormatter={formatMonthName}
              tick={{ fill: "#6b7075" }}
              axisLine={false}
              tickLine={false}
              fontSize={14}
              padding={{ left: 20, right: 0 }}
            />

            <YAxis
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.25)]}
              tick={{ fill: "#6b7075" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}€`}
            />

            <Tooltip cursor={false} content={<CustomTooltip />} />

            <Line
              dataKey="earnings"
              stroke="#ff5f00"
              strokeWidth={3}
              dot={false}
            ></Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartEarningsByMonth;
