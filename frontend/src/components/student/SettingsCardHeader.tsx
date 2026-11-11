import type { ComponentType, SVGProps } from "react";

type SettingsCardHeaderProps = {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
};

function SettingsCardHeader({
  id,
  icon: Icon,
  title,
  subtitle,
}: SettingsCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h2 id={id} className="text-base font-semibold text-primaryText">
          {title}
        </h2>
        <p className="text-xs text-secondaryText">{subtitle}</p>
      </div>
    </div>
  );
}

export default SettingsCardHeader;
