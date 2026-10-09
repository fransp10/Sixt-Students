type RacePageCardHeaderProps = {
  heading: string;
  subheading: string;
};

function RacePageCardHeader({ heading, subheading }: RacePageCardHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <h3 className="text-primaryText font-semibold">{heading}</h3>
      <p className="text-sm text-secondaryText font-semibold">{subheading}</p>
    </div>
  );
}

export default RacePageCardHeader;
