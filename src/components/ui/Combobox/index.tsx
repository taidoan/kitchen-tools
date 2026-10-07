"use client";

import Select, { GroupBase, MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import clsx from "clsx";
import { Label } from "../Label";

export type ComboboxOption = {
  value: string;
  label: string;
};

export type ComboboxGroup = {
  label: string;
  options: ComboboxOption[];
};

type ComboboxBaseProps = {
  isSearchable?: boolean;
  placeholder?: string;
  options: ComboboxOption[] | ComboboxGroup[];
  id: string;
  label: string;
  containerClassName?: string;
  hideRequiredIndicator?: boolean;
  className?: string;
  isClearable?: boolean;
  required: boolean;
  closeMenuOnSelect?: boolean;
};

type SingleComboboxProps = ComboboxBaseProps & {
  isMulti?: false;
  isCreatable?: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultiComboboxProps = ComboboxBaseProps & {
  isMulti: true;
  value: string[];
  onChange: (value: string[]) => void;
};

type ComboboxProps = SingleComboboxProps | MultiComboboxProps;

const flattenOptions = (
  options: ComboboxOption[] | ComboboxGroup[],
): ComboboxOption[] => {
  if (options.length === 0) return [];
  if ("options" in options[0]) {
    return (options as ComboboxGroup[]).flatMap((group) => group.options);
  }
  return options as ComboboxOption[];
};

const selectStyles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...provided,
    backgroundColor: "var(--input-bg)",
    border: `1px solid var(--input-border-clr)`,
    borderRadius: "var(--border-radius-small)",
    padding: "0",
    minHeight: "var(--input-height, 48px)",
    width: "100%",
    boxShadow: state.isFocused
      ? `0 0 0 1px var(--input-border-clr-focus)`
      : "none",
    "&:hover": {
      borderColor: "var(--input-border-clr)",
    },
  }),
  input: (provided: Record<string, unknown>) => ({
    ...provided,
    color: "var(--input-text-clr)",
    padding: "0 var(--input-padding-horizontal, 12px)",
    lineHeight: 1,
    "::placeholder": {
      color: "var(--clr-grey-400)",
    },
  }),
  placeholder: (provided: Record<string, unknown>) => ({
    ...provided,
    color: "var(--clr-grey-400)",
  }),
  singleValue: (provided: Record<string, unknown>) => ({
    ...provided,
    color: "var(--input-text-clr)",
  }),
  multiValue: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: "var(--btn-enabled-bg-light)",
  }),
  multiValueLabel: (provided: Record<string, unknown>) => ({
    ...provided,
    color: "var(--input-text-clr)",
  }),
  menu: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: "var(--select-dropdown-bg)",
    borderRadius: "var(--border-radius-small)",
    marginTop: "4px",
  }),
  option: (
    provided: Record<string, unknown>,
    state: { isSelected: boolean; isFocused: boolean },
  ) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--input-bg)"
      : state.isFocused
        ? "var(--clr-grey-100)"
        : "var(--select-dropdown-bg)",
    color: "var(--input-text-clr)",
    cursor: "pointer",
  }),
};

export const Combobox = (props: ComboboxProps) => {
  const {
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
    closeMenuOnSelect,
  } = props;

  const flatOptions = flattenOptions(options);

  return (
    <div className={clsx("form__input", containerClassName)}>
      <Label
        id={id}
        label={label}
        required={required}
        hideRequiredIndicator={hideRequiredIndicator}
      />
      {props.isMulti ? (
        <Select<ComboboxOption, true, GroupBase<ComboboxOption>>
          options={options}
          value={flatOptions.filter((option) => props.value.includes(option.value))}
          onChange={(selected: MultiValue<ComboboxOption>) =>
            props.onChange(selected.map((option) => option.value))
          }
          isMulti
          closeMenuOnSelect={closeMenuOnSelect ?? false}
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          inputId={id}
          instanceId={id}
          className={clsx(className)}
          classNamePrefix="combobox"
          styles={selectStyles as never}
        />
      ) : props.isCreatable ? (
        <CreatableSelect<ComboboxOption, false, GroupBase<ComboboxOption>>
          options={options}
          value={
            flatOptions.find((option) => option.value === props.value) ||
            (props.value
              ? { value: props.value, label: props.value }
              : null)
          }
          onChange={(option: SingleValue<ComboboxOption>) =>
            props.onChange(option?.value || null)
          }
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          inputId={id}
          instanceId={id}
          className={clsx(className)}
          classNamePrefix="combobox"
          styles={selectStyles as never}
          formatCreateLabel={(input) => `Add “${input}”`}
        />
      ) : (
        <Select<ComboboxOption, false, GroupBase<ComboboxOption>>
          options={options}
          value={flatOptions.find((option) => option.value === props.value) || null}
          onChange={(option: SingleValue<ComboboxOption>) =>
            props.onChange(option?.value || null)
          }
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          inputId={id}
          instanceId={id}
          className={clsx(className)}
          classNamePrefix="combobox"
          styles={selectStyles as never}
        />
      )}
    </div>
  );
};
