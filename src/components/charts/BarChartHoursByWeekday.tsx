import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", hours: 12 },
  { day: "Tue", hours: 8 },
  { day: "Wed", hours: 15 },
  { day: "Thu", hours: 18 },
  { day: "Fri", hours: 17 },
  { day: "Sat", hours: 9 },
  { day: "Sun", hours: 5 },
];

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
          <BarChart data={data}>
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

            <Bar dataKey="hours" fill="#ff5f00" radius={[6, 6, 0, 0]}></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartHoursByWeekday;
