import clsx from "clsx";
import { Label } from "../Label";

type CheckboxProps = {
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({
  id,
  label,
  containerClassName,
  className,
  hideRequiredIndicator,
  ...props
}: CheckboxProps) => {
  return (
    <div
      className={clsx(
        "form__input",
        "form__input--checkbox",
        containerClassName
      )}
    >
      <Label
        id={id}
        label={label}
        className="form__checkbox-label"
        hideRequiredIndicator={hideRequiredIndicator}
      />
      <input type="checkbox" id={id} className={clsx(className)} {...props} />
    </div>
  );
};
