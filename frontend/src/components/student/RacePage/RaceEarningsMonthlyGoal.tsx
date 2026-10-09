import RacePageCardHeader from "./RacePageCardHeader";

type RaceEarningsMonthlyGoalProps = {
  earned: number;
  goal: number;
};

function RaceEarningsMonthlyGoal({
  earned,
  goal,
}: RaceEarningsMonthlyGoalProps) {
  const pct = Math.min(earned / goal, 1); // 0 to 1, capped so it cant go past the goal
  const ARC = Math.PI * 100; // length of a half circle with radius 100

  const arc = "M20 130 A100 100 0 0 1 220 130"; // half circle path
  const difference = Math.round((goal - earned) * 10) / 10;
  const differencePct = Math.round((earned / goal) * 100);

  return (
    <div className=" col-span-1 row-span-1  flex flex-col bg-cardLighterBG rounded-lg p-6 h-84">
      <RacePageCardHeader
        heading="Monthly Goal"
        subheading={`Goal: ${goal}€`}
      />
      <div className="flex flex-col mt-4 w-full items-center">
        <svg viewBox="0 0 240 140" className="w-60">
          {/* grey track */}
          <path
            d={arc}
            fill="none"
            className="stroke-surfaceCards"
            strokeWidth={16}
            strokeLinecap="round"
          />
          {/* orange progress: draw pct of the length, then a gap */}
          <path
            d={arc}
            fill="none"
            className="stroke-primary transition-all duration-700"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={`${pct * ARC} ${ARC}`}
          />
          {/* needle: points up, rotated −90° (empty) to +90° (goal reached) around the center */}
          <line
            x1={120}
            y1={130}
            x2={120}
            y2={48}
            className="stroke-primaryText"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${-90 + pct * 180} 120 130)`}
          />
          <circle cx={120} cy={130} r={8} className="fill-primaryText" />
        </svg>
        <div className="flex flex-col gap-0.5 items-center mt-4 text-primaryText">
          <p className="text-4xl font-extrabold tracking-wider">{earned}€</p>
          {difference > 0 && (
            <div className="flex flex-row items-center gap-1.5 text-primary font-bold">
              <p>{differencePct}%</p>
              <p className="text-sm text-secondaryText">
                of goal · {difference}€ to go
              </p>
            </div>
          )}
          {difference <= 0 && (
            <div className="flex flex-row items-center gap-1.5 text-success font-bold">
              <p>Goal reached!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RaceEarningsMonthlyGoal;
