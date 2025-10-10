import clsx from "clsx";
import { Label } from "../Label";

type SelectProps = {
  id: string;
  label: string;
  containerClassName?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  id,
  label,
  containerClassName,
  className,
  ...props
}: SelectProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label id={id} label={label} required={props.required} />
      <select id={id} className={clsx(className)} {...props} />
    </div>
  );
};
