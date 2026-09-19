type PageHeadingProps = {
  heading: string;
  subheading: string;
};

function PageHeading({ heading, subheading }: PageHeadingProps) {
  return (
    <div className="text-primaryText font-semibold flex flex-col  ">
      <h1 className="text-2xl md:text-3xl">{heading}</h1>
      <p className="text-base md:text-xl text-secondaryText font-semibold">
        {subheading}
      </p>
    </div>
  );
}

export default PageHeading;
