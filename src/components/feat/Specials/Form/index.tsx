"use client";

import type { Special } from "./types";
import { useState } from "react";
import { PRODUCTS } from "@config";
import { Button, Input, Select, Combobox } from "@/components/ui";
import clsx from "clsx";
import style from "./style.module.scss";

type SpecialsFormProps = {
  specials: Special[];
  setSpecials: React.Dispatch<React.SetStateAction<Special[]>>;
};

const CUSTOM_DISCOUNTS = [1, 2, 3, 4, 5];

export const SpecialsForm = ({ specials, setSpecials }: SpecialsFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number>(2);
  const [customDescription, setCustomDescription] = useState("");

  const productObj = PRODUCTS.find((p) => p.product === selectedProduct);
  const isCustom = Boolean(selectedProduct && !productObj);
  const selectedProducts = specials.map((s) => s.product.toLowerCase());
  const options = PRODUCTS.filter(
    (p) => !selectedProducts.includes(p.product.toLowerCase())
  ).map((p) => ({
    value: p.product,
    label: p.product,
  }));
  const discountOptions = productObj?.discounts ?? CUSTOM_DISCOUNTS;

  const handleProductChange = (option: string | null) => {
    setSelectedProduct(option);
    const nextProduct = PRODUCTS.find((p) => p.product === option);
    if (nextProduct) {
      setCustomDescription("");
      setSelectedDiscount(nextProduct.discounts[1] ?? nextProduct.discounts[0]);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const name = selectedProduct?.trim() ?? "";
    const description = productObj?.description ?? customDescription.trim();

    if (
      !name ||
      !description ||
      selectedProducts.includes(name.toLowerCase())
    ) {
      return;
    }

    setSpecials((prev) => [
      ...prev,
      {
        product: name,
        discount: selectedDiscount,
        description,
        editable: false,
      },
    ]);

    setSelectedProduct(null);
    setCustomDescription("");
    setSelectedDiscount(2);
  };

  return (
    <form className={clsx(style.form)} onSubmit={handleAdd}>
      <Combobox
        options={options}
        value={selectedProduct}
        onChange={handleProductChange}
        isSearchable={true}
        isCreatable={true}
        placeholder="Select or type a custom item..."
        required
        hideRequiredIndicator
        label="Product"
        id="product"
        containerClassName={clsx(style.select)}
      />
      {isCustom && (
        <Input
          id="custom-description"
          label="Description"
          required
          hideRequiredIndicator
          placeholder="How it should read on the menu..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          containerClassName={style.description}
        />
      )}
      <Select
        id="discount"
        label="Discount"
        required
        hideRequiredIndicator
        containerClassName={style.discount}
        value={selectedDiscount}
        onChange={(e) => setSelectedDiscount(Number(e.target.value))}
      >
        {discountOptions.map((discount) => (
          <option key={discount} value={discount}>
            £{discount}
          </option>
        ))}
      </Select>
      <Button className={clsx(style.add__button)} type="submit">
        Add
      </Button>
    </form>
  );
};
