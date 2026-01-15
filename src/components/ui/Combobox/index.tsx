"use client";

import Select, { SingleValue } from "react-select";
import clsx from "clsx";
import { Label } from "../Label";

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  isSearchable?: boolean;
  placeholder?: string;
  options: Option[];
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
  className?: string;
  isClearable?: boolean;
  required: boolean;
};

export const Combobox = ({
  value,
  onChange,
  isSearchable = true,
  placeholder = "Select...",
  id,
  label,
  containerClassName,
  hideRequiredIndicator,
  options,
  className,
  isClearable = true,
  required,
}: ComboboxProps) => {
  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label
        id={id}
        label={label}
        required={required}
        hideRequiredIndicator={hideRequiredIndicator}
      />
      <Select
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<Option>) =>
          onChange(option?.value || null)
        }
        isSearchable={isSearchable}
        isClearable={isClearable}
        placeholder={placeholder}
        inputId={id}
        className={clsx(className)}
        classNamePrefix="combobox"
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: "var(--input-bg)",
            border: `1px solid var(--input-border-clr)`,
            borderRadius: "var(--border-radius-small)",
            padding: "0",
            minHeight: "var(--input-height, 48px)",
            boxShadow: state.isFocused
              ? `0 0 0 1px var(--input-border-clr-focus)`
              : "none",
            "&:hover": {
              borderColor: "var(--input-border-clr)",
            },
          }),
          input: (provided) => ({
            ...provided,
            color: "var(--input-text-clr)",
            padding: "0 var(--input-padding-horizontal, 12px)",
            lineHeight: 1,
            "::placeholder": {
              color: "var(--clr-grey-400)",
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "var(--clr-grey-400)",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "var(--input-text-clr)",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "var(--select-dropdown-bg)",
            borderRadius: "var(--border-radius-small)",
            marginTop: "4px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "var(--input-bg)"
              : state.isFocused
              ? "var(--clr-grey-100)"
              : "var(--select-dropdown-bg)",
            color: "var(--input-text-clr)",
            cursor: "pointer",
          }),
        }}
      />
    </div>
  );
};
