import clsx from "clsx";
import { Label } from "../Label";

type InputProps = {
  id: string;
  label: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  id,
  label,
  containerClassName,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label id={id} label={label} required={props.required} />
      <input id={id} className={clsx(className)} {...props} />
    </div>
  );
};
