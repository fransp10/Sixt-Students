type RacePageCardHeaderProps = {
  heading: string;
  subheading: string;
};

function RacePageCardHeader({ heading, subheading }: RacePageCardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:gap-4   ">
      <h3 className="text-primaryText text-left font-semibold">{heading}</h3>
      <p className="text-sm text-secondaryText sm:text-right font-semibold">
        {subheading}
      </p>
    </div>
  );
}

export default RacePageCardHeader;
