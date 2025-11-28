import clsx from "clsx";
import { Label } from "../Label";

type InputProps = {
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  id,
  label,
  containerClassName,
  hideRequiredIndicator,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label
        id={id}
        label={label}
        required={props.required}
        hideRequiredIndicator={hideRequiredIndicator}
      />
      <input id={id} className={clsx(className)} {...props} />
    </div>
  );
};
