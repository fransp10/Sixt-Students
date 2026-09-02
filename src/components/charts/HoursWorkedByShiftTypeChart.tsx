import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
const data = [
  { name: "Morning", value: 12, fill: "#ff5f00" },
  { name: "Middle", value: 8, fill: "#ff7a2f" },
  { name: "Afternoon", value: 15, fill: "#ff945c" },
];

function CustomTooltip({ active, payload }: any) {
  if (!active && !payload.length) {
    return null;
  }
  return (
    <div className="rounded-lg border border-borderDividers bg-cardBG px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-primaryText">{payload[0].name}</p>
      <p className="text-sm text-secondaryText">{payload[0].value} hours</p>
    </div>
  );
}

function HoursWorkedByShiftTypeChart() {
  const totalHours = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="flex flex-col h-82 w-full p-4 rounded-xl border border-borderDividers bg-cardBG">
      <div className="mb-6 shrink-0">
        <h2 className="text-lg font-semibold text-primaryText">
          Hours worked by shift type
        </h2>

        <p className="mt-1 text-sm text-secondaryText">
          Total hours worked in each shift type
        </p>
      </div>
      <div className="flex flex-col flex-1 items-center gap-4 xl:gap-12  sm:flex-row sm:justify-center">
        {/* Donut */}
        <div className="relative size-48 shrink-0 lg:size-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="90%"
                stroke="none"
              />
              <Tooltip offset={30} content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className=" pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-primaryText">
              {totalHours} h
            </span>

            <span className="text-sm text-secondaryText">Total</span>
          </div>
        </div>

        {/* Custom legend */}
        <div className="flex md:flex-col text-xs gap-4">
          {data.map((item) => {
            const percentage = Math.round((item.value / totalHours) * 100);

            return (
              <div key={item.name} className="flex items-start gap-1 sm:gap-2">
                <div
                  className="mt-1.5 size-2 sm:size-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />

                <div>
                  <p className="text-sm sm:text-medium lg:text-lg text-primaryText">
                    {item.name}
                  </p>

                  <p className="text-xs sm:text-sm lg:text-base text-secondaryText">
                    {item.value}h ({percentage}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HoursWorkedByShiftTypeChart;
