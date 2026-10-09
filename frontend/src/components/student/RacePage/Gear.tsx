import RacePageCardHeader from "./RacePageCardHeader";

const gears = [
  { gear: 1, hoursRequired: 0, name: "First gear" },
  { gear: 2, hoursRequired: 100, name: "Second gear" },
  { gear: 3, hoursRequired: 300, name: "Third gear" },
  { gear: 4, hoursRequired: 600, name: "Fourth gear" },
  { gear: 5, hoursRequired: 1000, name: "Fifth gear" },
  { gear: 6, hoursRequired: 1500, name: "Sixt gear" },
];

function Gear({ hoursWorked }: { hoursWorked: number }) {
  const currentGear = gears.reduce((prev, next) => {
    return hoursWorked >= next.hoursRequired ? next : prev;
  });

  const nextGear = currentGear.gear < 6 ? gears[currentGear.gear] : null;

  const hoursToNextGear = nextGear
    ? nextGear.hoursRequired - hoursWorked
    : null;

  const array = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <div className="col-span-1 bg-cardLighterBG rounded-lg text-primaryText p-6">
      <RacePageCardHeader
        heading="Current gear"
        subheading="Unlocks by hours worked"
      />

      <div className="flex flex-row gap-4  items-center mt-12">
        <div className="flex items-center justify-center size-20 border-3 rounded-full border-primary">
          <p className="text-4xl font-bold text-primary">{currentGear.gear}</p>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl">{currentGear.name}</span>
          <span className="text-secondaryText font-semibold text-lg">
            {hoursToNextGear}h until {nextGear?.name} ({nextGear?.hoursRequired}
            h)
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-10 items-center">
        {array.map((gear) => (
          <div key={gear} className="flex flex-col items-center gap-0.5">
            <div
              className={`p-2 px-8 rounded-lg ${gear <= currentGear.gear ? "bg-primary" : "bg-surfaceCards"}`}
            ></div>
            <p
              className={`font-bold ${gear === currentGear.gear ? "text-primary" : "text-secondaryText"}`}
            >
              {gear}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gear;
