import { useAuthContext } from "../../../../hooks/auth/useAuthContext";
import Car from "./Car";

type RacingLineProps = {
  position: number;
  racer: string;
  dataValue: number;
  maxValue: number;
  prefix?: string;
  sufix?: string;
  racerId: number;
};

function RacingLine({
  position,
  racer,
  dataValue,
  maxValue,
  prefix,
  sufix,
  racerId,
}: RacingLineProps) {
  const percentage = (dataValue / maxValue) * 100;
  const { currentUser } = useAuthContext();

  const isCurrentUser = currentUser?.id === racerId;
  return (
    <li className="flex items-center gap-3  ">
      <span
        className={`w-6 shrink-0  ${isCurrentUser ? "text-primary" : "text-secondaryText"}`}
      >
        {position}
      </span>
      <span
        className={`w-28 shrink-0 truncate font-semibold ${isCurrentUser ? "text-primary" : ""}`}
      >
        {isCurrentUser ? `You` : `${racer}`}
      </span>
      <div className="relative h-8 flex-1 bg-headersCalendar rounded-lg overflow-hidden ">
        {/* middle line */}
        <div className="absolute left-0 right-3 top-1/2 border-t-2 border-dashed border-icons/50 " />
        {/* finish line */}
        <div className="absolute inset-y-0 right-0 w-3 bg-[repeating-conic-gradient(#e5e7ea_0_25%,#1c2027_0_50%)] bg-size-[6px_6px] opacity-60" />
        <div
          className={` h-full bg-icons/20 `}
          style={{ width: `${percentage}%` }}
        />
        <Car
          className={`absolute top-1/2 -translate-x-full -translate-y-1/2 `}
          style={{
            left: `${percentage}%`,
            color: isCurrentUser
              ? "#ff5f00"
              : position === 1
                ? "#ffff"
                : "#838992",
          }}
        />
      </div>
      <span
        className={`w-14 shrink-0 text-right font-bold ${isCurrentUser ? "text-primary" : ""}`}
      >
        {prefix}
        {dataValue}
        {sufix}
      </span>
    </li>
  );
}

export default RacingLine;
