type PageHeadingProps = {
  heading: string;
  subheading: string;
};

function PageHeading({ heading, subheading }: PageHeadingProps) {
  return (
    <div className="text-primaryText flex flex-col gap-1 ">
      <h1 className="text-3xl">{heading}</h1>
      <p className="text-l text-secondaryText">{subheading}</p>
    </div>
  );
}

export default PageHeading;
