function EmptyStatsCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-borderDividers bg-cardBG p-5 text-center sm:col-span-2 xl:col-span-4">
      <p className="text-sm font-medium text-primaryText">
        No stats for this month
      </p>
      <p className="mt-1 text-sm text-secondaryText">
        Work a shift and your numbers will show up here.
      </p>
    </div>
  );
}

export default EmptyStatsCard;
