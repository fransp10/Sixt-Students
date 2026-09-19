import type { ComponentType } from "react";

type FeatureListItemProps = {
  heading: string;
  subheading: string;
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
};

function FeatureListItem({
  heading,
  subheading,
  icon: Icon,
}: FeatureListItemProps) {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-darkBackground">
        <Icon className="size-5 text-secondaryText" />
      </div>
      <div className="flex flex-col gap-0">
        <span className="text-lg">{heading}</span>
        <span className="text-md text-secondaryText">{subheading}</span>
      </div>
    </div>
  );
}

export default FeatureListItem;
