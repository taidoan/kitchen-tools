import clsx from "clsx";
import { Label } from "../Label";

type TextareaProps = {
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({
  id,
  label,
  containerClassName,
  className,
  hideRequiredIndicator,
  ...props
}: TextareaProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label
        id={id}
        label={label}
        required={props.required}
        hideRequiredIndicator={hideRequiredIndicator}
      />
      <textarea id={id} className={clsx(className)} {...props} />
    </div>
  );
};
