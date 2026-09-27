import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", earnings: 120 },
  { month: "Feb", earnings: 240 },
  { month: "Mar", earnings: 180 },
  { month: "Apr", earnings: 300 },
  { month: "May", earnings: 200 },
  { month: "Jun", earnings: 280 },
  { month: "Jul", earnings: 150 },
  { month: "Aug", earnings: 220 },
  { month: "Sep", earnings: 260 },
  { month: "Oct", earnings: 190 },
  { month: "Nov", earnings: 310 },
  { month: "Dec", earnings: 270 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-borderDividers bg-cardBG px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm text-secondaryText">{label}</p>
      <p className=" font-semibold text-primaryText">
        <span className="text-primary">{payload[0].value}€</span>
        <span> earned </span>
      </p>
    </div>
  );
}

function BarChartEarningsByMonth() {
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
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="#1a1e21" />

            <XAxis
              dataKey="month"
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
