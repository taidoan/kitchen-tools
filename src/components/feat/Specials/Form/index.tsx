"use client";

import type { Special } from "./types";
import { useState } from "react";
import { PRODUCTS } from "@config";
import { Button, Select, Combobox } from "@/components/ui";
import clsx from "clsx";
import style from "./style.module.scss";

type SpecialsFormProps = {
  specials: Special[];
  setSpecials: React.Dispatch<React.SetStateAction<Special[]>>;
};

export const SpecialsForm = ({ specials, setSpecials }: SpecialsFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(
    PRODUCTS[0].discounts[1]
  );

  const productObj = PRODUCTS.find((p) => p.product === selectedProduct);
  const selectedProducts = specials.map((s) => s.product);
  const options = PRODUCTS.filter(
    (p) => !selectedProducts.includes(p.product)
  ).map((p) => ({
    value: p.product,
    label: p.product,
  }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedProduct ||
      selectedDiscount === null ||
      specials.some((s) => s.product === selectedProduct)
    ) {
      return;
    }

    if (selectedProduct && selectedDiscount !== null && productObj) {
      setSpecials((prev) => [
        ...prev,
        {
          product: selectedProduct,
          discount: selectedDiscount,
          description: productObj.description,
          editable: false,
        },
      ]);

      const remainingProducts = PRODUCTS.filter(
        (p) => p.product !== selectedProduct
      );

      setSelectedProduct(remainingProducts[0]?.product ?? null);
      setSelectedDiscount(remainingProducts[0]?.discounts[0] ?? null);
    }
  };

  return (
    <form className={clsx(style.form)} onSubmit={handleAdd}>
      <Combobox
        options={options}
        value={selectedProduct}
        onChange={(option) => setSelectedProduct(option)}
        isSearchable={true}
        placeholder="Select a product..."
        required
        hideRequiredIndicator
        label="Product"
        id="product"
        containerClassName={clsx(style.select)}
      />
      <Select
        id="discount"
        label="Discount"
        className="input--small"
        required
        hideRequiredIndicator
        value={selectedDiscount ?? productObj?.discounts[0]}
        onChange={(e) => setSelectedDiscount(Number(e.target.value))}
      >
        {productObj?.discounts.map((discount) => (
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
