function CarIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 60 22"
      className={`h-5 w-14 ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* rear wing: post + blade */}
      <path
        d="M5 11 L6 6.8 M1.5 6.6 L10.5 6.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* body: low wedge, cabin set back, long hood to a rounded nose on the right */}
      <path
        d="M2 16 L2 11.5 L10 10.5 C16 9.5 19 5 26 4.6 C32 4.4 36 7 40 9 L54 11.5 Q58 12.5 58 15 L58 16 Z"
        fill="currentColor"
      />
      {/* window */}
      <path
        d="M19.5 8.8 C22 6.2 25 5.6 28 5.6 C31.5 5.6 34 7 36 8.8 Z"
        fill="#08090b"
        opacity="0.55"
      />
      {/* side stripe */}
      <path
        d="M14 12.6 L50 13.2"
        stroke="#08090b"
        strokeWidth="1"
        opacity="0.35"
      />
      {/* headlight */}
      <path
        d="M53 11.8 L56.5 12.6"
        stroke="#e5e7ea"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* wheels: dark tyre, coloured rim, hub */}
      <circle
        cx="14"
        cy="16.5"
        r="4.6"
        fill="#08090b"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="14" cy="16.5" r="1.4" fill="currentColor" />
      <circle
        cx="47"
        cy="16.5"
        r="4.6"
        fill="#08090b"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="47" cy="16.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default CarIcon;
