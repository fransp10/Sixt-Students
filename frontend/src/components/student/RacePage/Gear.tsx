import RacePageCardHeader from "./RacePageCardHeader";

function Gear() {
  const currentGear = 4;
  const array = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <div className="col-span-1 bg-cardLighterBG rounded-lg text-primaryText p-6">
      <RacePageCardHeader
        heading="Current gear"
        subheading="Unlocks by hours worked"
      />

      <div className="flex flex-row gap-4  items-center mt-12">
        <div className="flex items-center justify-center size-20 border-3 rounded-full border-primary">
          <p className="text-4xl font-bold text-primary">4</p>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl">Fourth gear</span>
          <span className="text-secondaryText font-semibold text-lg">
            51th until fifth gear (700h)
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-10 items-center">
        {array.map((gear) => (
          <div key={gear} className="flex flex-col items-center gap-0.5">
            <div
              className={`p-2 px-8 rounded-lg ${gear <= currentGear ? "bg-primary" : "bg-surfaceCards"}`}
            ></div>
            <p
              className={`font-bold ${gear === currentGear ? "text-primary" : "text-secondaryText"}`}
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
