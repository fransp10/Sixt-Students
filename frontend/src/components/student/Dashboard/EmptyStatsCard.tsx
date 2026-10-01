function EmptyStatsCard() {
  return (
    <div className="rounded-xl border h-32 border-borderDividers bg-cardLighterBG p-5 flex flex-col items-center justify-center">
      <p className="text-sm text-primaryText">
        You have no stats for this month.
      </p>
      <p className="text-xs text-secondaryText">
        Start working to see your stats here!
      </p>
    </div>
  );
}

export default EmptyStatsCard;
