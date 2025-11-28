import clsx from "clsx";
import { Label } from "../Label";

type SelectProps = {
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  id,
  label,
  containerClassName,
  className,
  hideRequiredIndicator,
  ...props
}: SelectProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label
        id={id}
        label={label}
        required={props.required}
        hideRequiredIndicator={hideRequiredIndicator}
      />
      <select id={id} className={clsx(className)} {...props} />
    </div>
  );
};
