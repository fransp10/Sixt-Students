import { useState } from "react";
import { format, parse, startOfMonth, subMonths } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMonthlyTotals } from "../../hooks/useMonthlyTotals";
import { formatStat } from "../../helpers/formatStat";
import type { MonthlyTotals } from "../../api/adminApi";

const MONTHS_SHOWN = 6;

type Metric = "hours" | "payroll";

const metrics: Record<Metric, { label: string; unit: string }> = {
  hours: { label: "Hours", unit: "h" },
  payroll: { label: "Payroll", unit: "€" },
};

type ChartRow = MonthlyTotals & { label: string; isCurrent: boolean };

// the backend may leave out months with no worked shifts, so fill those with 0
function buildRows(totals: MonthlyTotals[]): ChartRow[] {
  const byMonth = new Map(totals.map((t) => [t.month, t]));
  const currentMonth = startOfMonth(new Date());

  return Array.from({ length: MONTHS_SHOWN }, (_, i) => {
    const date = subMonths(currentMonth, MONTHS_SHOWN - 1 - i);
    const month = format(date, "yyyy-MM");
    const total = byMonth.get(month);
    return {
      month,
      hours: total?.hours ?? 0,
      payroll: total?.payroll ?? 0,
      label: format(date, "MMM"),
      isCurrent: i === MONTHS_SHOWN - 1,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, mode }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const row: ChartRow = payload[0].payload;
  const monthName = format(parse(row.month, "yyyy-MM", new Date()), "MMMM");

  return (
    <div className="rounded-lg border border-borderDividers bg-cardBG px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm text-secondaryText">
        {monthName}
        {row.isCurrent && " (so far)"}
      </p>
      {mode === "hours" && (
        <p className="font-semibold text-primaryText">
          {formatStat(row.hours, "h")}
        </p>
      )}
      {mode === "payroll" && (
        <p className="font-semibold text-primaryText">
          {formatStat(row.payroll, "€")}
        </p>
      )}
    </div>
  );
}

function AdminHoursPayrollChart() {
  const [metric, setMetric] = useState<Metric>("hours");
  const { data: totals, isLoading, isError } = useMonthlyTotals(MONTHS_SHOWN);

  const rows = buildRows(totals ?? []);
  const { unit } = metrics[metric];

  return (
    <div className="flex flex-col gap-4 col-span-3 bg-cardBG h-120 p-4 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-primaryText font-bold">Hours & payroll</h2>
          <p className="text-xs text-secondaryText">
            All students · last {MONTHS_SHOWN} months
          </p>
        </div>
        <div
          role="group"
          aria-label="Metric"
          className="flex rounded-lg border border-borderDividers bg-surfaceSideBar p-0.5"
        >
          {(Object.keys(metrics) as Metric[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={metric === key}
              onClick={() => setMetric(key)}
              className={`h-8 rounded-md px-3.5 text-sm font-semibold cursor-pointer ${
                metric === key
                  ? "bg-darkBackground text-primaryText"
                  : "text-secondaryText hover:text-primaryText"
              }`}
            >
              {metrics[key].label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

      {isError && (
        <p className="text-sm text-secondaryText">
          Couldn't load hours and payroll
        </p>
      )}

      {!isLoading && !isError && (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#1a1e21" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8b9096" }}
                axisLine={false}
                tickLine={false}
                fontSize={13}
              />
              <YAxis
                tick={{ fill: "#6b7075" }}
                axisLine={false}
                tickLine={false}
                fontSize={12}
                width={56}
                tickFormatter={(value) => formatStat(value, unit)}
              />
              <Tooltip
                cursor={{ fill: "#ffffff08" }}
                content={<CustomTooltip mode={metric} />}
              />
              <Bar
                dataKey={metric}
                radius={[4, 4, 0, 0]}
                maxBarSize={56}
                shape={(props) => {
                  const { x, y, width, height } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={"#ff5f00"}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AdminHoursPayrollChart;
