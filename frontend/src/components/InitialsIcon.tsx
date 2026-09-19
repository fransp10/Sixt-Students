import { getInitials } from "../helpers/helpers";

type InitialsIconProps = {
  name: string;
  size?: number;
  className?: string;
};

function InitialsIcon({ name, size = 48, className = "" }: InitialsIconProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
      }}
      className={`
        flex shrink-0 items-center justify-center
        rounded-full
        bg-surfaceCards/50
         font-bold
        text-primary
        ${className}
      `}
    >
      {getInitials(name)}
    </span>
  );
}

export default InitialsIcon;
