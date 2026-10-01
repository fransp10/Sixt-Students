import RacePageCardHeader from "./RacePageCardHeader";

function Drum({
  digit,
  className = "",
}: {
  digit: string;
  className?: string;
}) {
  return (
    <span
      className={`flex h-14 w-9 items-center justify-center border-r border-black/60 bg-linear-to-b from-black/50 via-transparent to-black/50 text-3xl font-semibold last:border-r-0 sm:w-10 ${className}`}
    >
      {digit}
    </span>
  );
}

function Odometer() {
  const earnings = 5518.22;

  const [whole, cents] = earnings.toFixed(2).split(".");
  const wholeDigits = whole.padStart(5, "0").split("");
  const firstRealDigit = wholeDigits.findIndex((d) => d !== "0");

  return (
    <div className="col-span-1 flex flex-col rounded-lg bg-cardLighterBG p-6 text-primaryText">
      <RacePageCardHeader heading="Odometer" subheading="All-time earnings" />

      <div className="flex flex-1 flex-col justify-center gap-6 mt-4">
        <div
          className="flex items-center justify-center gap-2 tabular-nums"
          aria-label={`€${earnings.toFixed(2)} earned all time`}
        >
          <span className="text-2xl font-semibold text-secondaryText">€</span>

          <div className="flex overflow-hidden rounded-lg border border-borderDividers bg-pageBackground">
            {wholeDigits.map((digit, index) => (
              <Drum
                key={index}
                digit={digit}
                className={index < firstRealDigit ? "text-secondaryText" : ""}
              />
            ))}

            {/* cents get their own colour, like the tenths drum on a real odometer */}
            <div className="flex border-l-2 border-primary/60 bg-primary/10 text-primary">
              {cents.split("").map((digit, index) => (
                <Drum key={index} digit={digit} />
              ))}
            </div>
          </div>
        </div>

        <div className="h-1 bg-borderDividers" />

        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xl font-bold tabular-nums">649h</p>
            <p className="text-sm text-secondaryText">Hours driven</p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums">84</p>
            <p className="text-sm text-secondaryText">Laps (shifts)</p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums">€8.50</p>
            <p className="text-sm text-secondaryText">Per hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Odometer;
