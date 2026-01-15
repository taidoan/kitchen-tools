import type { Special } from "../types";

type SpecialsItemProps = {
  className?: string;
  product: string;
  discount: number;
  description: string;
  editable: boolean;
  onToggleEdit: () => void;
  onRemove: () => void;
  updateSpecial: (updates: Partial<Special>) => void;
};

import { InnerCard, ControlButton, Label } from "@/components/ui";
import { IconLock, IconLockOpen, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import style from "./style.module.scss";

export const SpecialsItem = ({
  className,
  product,
  discount,
  description,
  editable,
  onToggleEdit,
  onRemove,
  updateSpecial,
  ...props
}: SpecialsItemProps) => {
  return (
    <InnerCard
      padding="small"
      className={clsx(style.item, className)}
      {...props}
    >
      <div className={clsx(style.text)}>
        {editable ? (
          <div className={clsx("form__input", "form__input--small")}>
            <Label id="product" label="Product" required />
            <input
              type="text"
              value={product}
              onChange={(e) => updateSpecial({ product: e.target.value })}
            />
          </div>
        ) : (
          <h3 className={style.title}>{product}</h3>
        )}
        {editable ? (
          <div className={clsx("form__input", "form__input--small")}>
            <Label id="description" label="Description" required />
            <input
              type="text"
              value={description}
              onChange={(e) => updateSpecial({ description: e.target.value })}
            />
          </div>
        ) : (
          <p>{description}</p>
        )}
        {editable ? (
          <div className={clsx("form__input", "form__input--small")}>
            <Label id="discount" label="Discount" required />
            <input
              type="number"
              value={discount}
              onChange={(e) =>
                updateSpecial({ discount: Number(e.target.value) })
              }
            />
          </div>
        ) : (
          <p className={style.discount}>
            <strong>£{discount}</strong> Discount
          </p>
        )}
      </div>

      <div className={style.controls}>
        <ControlButton
          size="small"
          className={style.lock}
          onClick={onToggleEdit}
        >
          {editable ? <IconLockOpen /> : <IconLock />}
        </ControlButton>
        <ControlButton
          size="small"
          className={style.remove}
          onClick={onRemove}
          type="close"
        >
          <IconX />
        </ControlButton>
      </div>
    </InnerCard>
  );
};
