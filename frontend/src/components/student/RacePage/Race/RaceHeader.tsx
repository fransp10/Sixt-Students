function RaceHeader() {
  return (
    <div className="flex flex-col text-primaryText">
      <h2 className="text-xl font-bold">This race</h2>
      <p className="text-sm text-secondaryText font-semibold">
        Hours or number of shifts worked in a selected month. The leader sets
        the finish line.
      </p>
    </div>
  );
}

export default RaceHeader;
