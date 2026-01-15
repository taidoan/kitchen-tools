"use client";

import { useState } from "react";
import { PRODUCTS } from "@config";
import { Button, Select, Combobox } from "@/components/ui";
import clsx from "clsx";
import style from "./style.module.scss";

export const SpecialsForm = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(
    PRODUCTS[0].product
  );
  const productObj = PRODUCTS.find((p) => p.product === selectedProduct);
  const options = PRODUCTS.map((p) => ({
    value: p.product,
    label: p.product,
  }));

  return (
    <div className={clsx(style.form)}>
      <Combobox
        options={options}
        value={selectedProduct}
        onChange={(option) => setSelectedProduct(option)}
        isSearchable={true}
        placeholder="Select a product..."
        required
        label="Product"
        id="product"
        containerClassName={clsx(style.select)}
      />
      <Select
        id="discount"
        label="Discount"
        className="input--small"
        required
        value={productObj?.discounts[1]}
        onChange={() => {}}
      >
        {productObj?.discounts.map((discount) => (
          <option key={discount} value={discount}>
            £{discount}
          </option>
        ))}
      </Select>
      <Button className={clsx(style.add__button)}>Add</Button>
    </div>
  );
};
