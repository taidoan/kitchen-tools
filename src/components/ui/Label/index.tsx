import clsx from "clsx";

type LabelProps = {
  id: string;
  label: string;
  required?: boolean;
  hideRequiredIndicator?: boolean;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({
  id,
  label,
  required = false,
  className,
  hideRequiredIndicator = false,
  ...props
}: LabelProps) => {
  return (
    <label htmlFor={id} className={clsx("form__label", className)} {...props}>
      <span className="form__label-text">{label}:</span>
      {!hideRequiredIndicator && (
        <>
          {required ? (
            <span className="form__label-small-text">
              (Required<span className="form__label--required">*</span>)
            </span>
          ) : (
            <span className="form__label-small-text">(Optional)</span>
          )}
        </>
      )}
    </label>
  );
};
