import Card from "@components/ui/Card";
import clsx from "clsx";
import scss from "./style.module.scss";
import { Icon } from "@components/ui/Icon";
import { Button } from "@components/ui/Button";

type QuickLinkProps = {
  title: string;
  href?: string;
  className?: string;
  description?: string;
  icon: "home" | "fdt" | "sales" | "special" | "wastage";
  cta?: string;
};

export const QuickLink = ({
  title,
  href,
  className,
  description,
  icon,
  cta = "Open",
}: QuickLinkProps) => {
  return (
    <Card
      textAlign="center"
      grow={true}
      className={clsx(scss.quicklink, className)}
    >
      <div className={scss.quicklink__content}>
        <Icon variant={icon} size="large" color="dark" />
        <div className={scss.quicklink__text}>
          <h2 className={scss.quicklink__title}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {href && (
        <Button href={href} centered>
          {cta}
        </Button>
      )}
    </Card>
  );
};
