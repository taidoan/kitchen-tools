import { PRODUCT_DESCRIPTIONS } from "./descriptions";
import { PRODUCT_DISCOUNTS } from "./discounts";

export const PRODUCT_GROUPS = [
  // Burns
  {
    description: "Haggis served with swede mash and mashed potatoes.",
    discounts: PRODUCT_DISCOUNTS.MEDIUM,
    products: ["Haggis, Neeps & Tatties"]
  },

  {
    description: "Served with chips, onion rings and whiskey sauce.",
    discounts: PRODUCT_DISCOUNTS.MEDIUM,
    products: ["The Caledonian Burger"],
  },

  // Breakfast
  {
    description: PRODUCT_DESCRIPTIONS.BENEDICTS,
    discounts: PRODUCT_DISCOUNTS.MEDIUM,
    products: ["Eggs Benedict", "Miners Benedict", "Mushroom Benedict"],
  },
  // Burgers
  {
    description: PRODUCT_DESCRIPTIONS.BURGERS,
    discounts: PRODUCT_DISCOUNTS.MAX,
    products: [
      "American Burger",
      "American Cheese Burger",
      "Classic Beef Burger",
      "Buttermilk Chicken Burger",
    ],
  },
  {
    description: PRODUCT_DESCRIPTIONS.XMAS_BURGERS,
    discounts: PRODUCT_DISCOUNTS.MAX,
    products: [
      "Brie & Bacon Burger",
      "Chicken & Stuffing Burger",
      "Buttermilk Chicken & Stuffing Burger",
    ],
  },
  {
    description: PRODUCT_DESCRIPTIONS.GOURMET_BURGERS,
    discounts: PRODUCT_DISCOUNTS.MAX,
    products: [
      "Empire State Burger",
      "Ultimate Burger",
      "Tennesee Beef Burger",
      "Big Smoke Beef Burger",
      "Big Smoke Buttermilk Chicken Burger",
      "Tennesee Buttermilk Chicken Burger",
      "Big Cheese Burger",
      "Beef Cheese Meltdown",
      "Buttermilk Chicken Cheese Meltdown",
      "Buffalo Burger",
    ],
  },
  // Currys
  {
    description: PRODUCT_DESCRIPTIONS.CURRY,
    discounts: PRODUCT_DISCOUNTS.MAX,
    products: [
      "Chicken Tikka Masala",
      "Chicken Jalfrezi",
      "Chicken Vindaloo",
      "Chicken Korma",
      "Beef Madras",
      "Sweet Potato Curry",
      "Prawn & Fish Curry",
    ],
  },
  {
    description: PRODUCT_DESCRIPTIONS.SIMPLE_CURRY,
    discounts: PRODUCT_DISCOUNTS.MEDIUM,
    products: [
      "Simple Chicken Tikka Masala",
      "Simple Chicken Jalfrezi",
      "Simple Beef Madras",
      "Simple Sweet Potato Curry",
    ],
  },
  // Paninis
  {
    description: PRODUCT_DESCRIPTIONS.PANINI,
    discounts: PRODUCT_DISCOUNTS.SMALL,
    products: [
      "Ham & Cheese Panini",
      "BBQ Chicken Panini",
      "Tuna & Cheese Panini",
      "Tomato & Cheese Panini",
    ],
  },
  // Jacket Potatoes
  {
    description: PRODUCT_DESCRIPTIONS.JACKET_POTATOES,
    discounts: PRODUCT_DISCOUNTS.MINIMUM,
    products: [
      "Jacket Potato with Cheese",
      "Jacket Potato with Beans",
      "Jacket Potato with Coleslaw",
      "Jacket Potato with Tuna",
      "Jacket Potato with Roasted Vegetables",
      "Jacket Potato with Chilli Non Carne",
    ],
  },
  // Small Plates
  {
    products: ["Shawarma Chips"],
    description: PRODUCT_DESCRIPTIONS.SHAWARMA_CHIPS,
    discounts: PRODUCT_DISCOUNTS.SMALL,
  },
  // Mains
  {
    description: PRODUCT_DESCRIPTIONS.COD,
    discounts: PRODUCT_DISCOUNTS.MAX,
    products: ["Cod & Chips"],
  },
  {
    products: ["Alfredo Pasta"],
    description: PRODUCT_DESCRIPTIONS.ALFREDO,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Smokey Non Carne"],
    description: PRODUCT_DESCRIPTIONS.NON_CARNE,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Ramen"],
    description: PRODUCT_DESCRIPTIONS.RAMEN,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Bangers & Mash", "Vegetarian Bangers & Mash"],
    description: PRODUCT_DESCRIPTIONS.SAUSAGE_MASH,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["BBQ Chicken Melt"],
    description: PRODUCT_DESCRIPTIONS.CHICKEN_MELT,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Ham, Egg & Chips"],
    description: PRODUCT_DESCRIPTIONS.CHIPS,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Beef Lasagne"],
    description: PRODUCT_DESCRIPTIONS.LASAGNE,
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
  {
    products: ["Korean Bowl"],
    description: PRODUCT_DESCRIPTIONS.KOREAN_BOWL,
    discounts: PRODUCT_DISCOUNTS.MEDIUM,
  },
  {
    products: ["Steak & Ale Pudding"],
    description: "Served with either chips or mash, peas & gravy.",
    discounts: PRODUCT_DISCOUNTS.MAX,
  },
];

export const PRODUCTS = PRODUCT_GROUPS.flatMap((group) =>
  group.products.map((name) => ({
    product: name,
    description: group.description,
    discounts: group.discounts,
  }))
);
