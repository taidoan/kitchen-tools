import clsx from "clsx";
import { Label } from "../Label";

type TextareaProps = {
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
  action?: React.ReactNode;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({
  id,
  label,
  containerClassName,
  className,
  hideRequiredIndicator,
  action,
  ...props
}: TextareaProps) => {
  return (
    <div className={clsx("form__input", containerClassName)}>
      {action ? (
        <div className="form__input-header">
          <Label
            id={id}
            label={label}
            required={props.required}
            hideRequiredIndicator={hideRequiredIndicator}
          />
          {action}
        </div>
      ) : (
        <Label
          id={id}
          label={label}
          required={props.required}
          hideRequiredIndicator={hideRequiredIndicator}
        />
      )}
      <textarea id={id} className={clsx(className)} {...props} />
    </div>
  );
};
