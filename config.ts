/**
 * Project configuration file.
 *
 * This file defines and exports absolute paths for key project directories,
 * such as source code, public assets, styles, components, and utilities.
 * Usage: Import 'config' from this file to access standardized directory paths
 * throughout the project, ensuring consistency and maintainability.
 */
import { join, resolve } from "path";
const rootDir = resolve(process.cwd());

const paths = {
  srcDir: join(rootDir, "src"),
  publicDir: join(rootDir, "public"),
};

const subdirs = {
  stylesDir: join(paths.srcDir, "styles"),
  componentsDir: join(paths.srcDir, "components"),
  libDir: join(paths.srcDir, "lib"),
  utilsDir: join(paths.srcDir, "lib", "utils"),
  assetsDir: join(paths.publicDir, "assets"),
  fontsDir: join(paths.publicDir, "assets", "fonts"),
  imagesDir: join(paths.publicDir, "assets", "images"),
  iconsDir: join(paths.publicDir, "assets", "icons"),
};

export const config = {
  rootDir,
  ...paths,
  ...subdirs,
};

// Initial data for the form, feel free to edit these values if needed.

// Late Target as a percentage
const late_percentage_target = 25;

// Preparation Target in minutes
const preparation_target = 8;

// Does the kitchen use a food lift? Default to false
const food_lift = false;

// Show kitchen lates (CHEF lates from KSRS)
const show_kitchen_lates = true;

// Show floor lates (Total Lates - CHEF Lates from KSRS)
const show_floor_lates = false;

// Show manual holds
const show_manual_holds = true;

// Actual sales data. Default to null
const sales = null;

// Sales forecast. Default to null
const sales_forecast = null;

// Late Target Options
// These are pretty sensible options for late targets.
export const LATE_TARGET_OPTIONS = [
  { value: 5, label: "5%" },
  { value: 10, label: "10%" },
  { value: 15, label: "15%" },
  { value: 20, label: "20%" },
  { value: 25, label: "25%" },
  { value: 30, label: "30%" },
];

// Late target threshold for warning class in percentage
export const LATE_TARGET_THRESHOLD = 10;

// Floor late maximum percentage
export const FLOOR_LATE_MAX_PERCENTAGE = 3;

// Food lift maximum wait time in minutes
export const FOOD_LIFT_WAIT_TIME = 1.5;

// No food lift maximum wait time
export const NO_FOOD_LIFT_WAIT_TIME = 1;

// Maximum prep time in minutes
export const MAX_PREP_TIME = preparation_target;

// Maximum delivery time in minutes
export const MAX_DELIVERY_TIME = 10;

// Maximum prep time with food lift
export const MAX_PREP_TIME_FOOD_LIFT = MAX_DELIVERY_TIME - FOOD_LIFT_WAIT_TIME;

// Maximum prep time without food lift
export const MAX_PREP_TIME_NO_FOOD_LIFT =
  MAX_DELIVERY_TIME - NO_FOOD_LIFT_WAIT_TIME;

// Prep Target Options
// These are pretty sensible options for prep targets. Maximum would be nine as company target overall is less than 10:00.
export const PREP_TARGET_OPTIONS = [
  { value: 6, label: "6:00" },
  { value: 6.5, label: "6:30" },
  { value: 7, label: "7:00" },
  { value: 7.5, label: "7:30" },
  { value: 8, label: "8:00" },
  { value: MAX_PREP_TIME_FOOD_LIFT, label: "8:30" },
  { value: MAX_PREP_TIME_NO_FOOD_LIFT, label: "9:00" },
];

// DO NOT EDIT THIS
export const DEFAULT_FORM_OPTIONS = {
  sales: sales,
  salesForecast: sales_forecast,
  lateTarget: late_percentage_target,
  prepTarget: preparation_target,
  foodLift: food_lift,
  kitLates: show_kitchen_lates,
  manualHolds: show_manual_holds,
  floorLates: show_floor_lates,
  copiedServiceData: "",
};

// DO NOT EDIT THIS
export const DEFAULT_SERVICE_SUMMARY = {
  siteName: "Wetherspoons",
  dateRange: "",
  averageDeliveryTime: {
    starters: "0",
    mains: "0",
    desserts: "0",
    total: "0",
  },
  averageWaitTime: {
    starters: "0",
    mains: "0",
    desserts: "0",
    total: "0",
  },
  averagePreparationTime: {
    starters: "0",
    mains: "0",
    desserts: "0",
    total: "0",
  },
  numberOfOrders: 0,
  numberOfLateOrders: {
    starters: { count: 0, percentage: 0 },
    mains: { count: 0, percentage: 0 },
    desserts: { count: 0, percentage: 0 },
    total: { count: 0, percentage: 0 },
  },
  numberOfItems: 0,
  numberOfLateItems: {
    starters: { count: 0, percentage: 0 },
    mains: { count: 0, percentage: 0 },
    desserts: { count: 0, percentage: 0 },
    total: { count: 0, percentage: 0 },
  },
  checksOnTime: {
    onTime: 0,
    early: 0,
    late: 0,
  },
  chef1: {
    averagePrepTime: "0",
    numberOfOrders: 0,
    ordersLate: { count: 0, percentage: 0 },
    numberOfItems: 0,
    itemsLate: { count: 0, percentage: 0 },
    ordersBumped: 0,
    manualHolds: 0,
  },
  dispense: {
    averagePrepTime: "0",
    numberOfOrders: 0,
    ordersLate: { count: 0, percentage: 0 },
    numberOfItems: 0,
    itemsLate: { count: 0, percentage: 0 },
    ordersBumped: 0,
    manualHolds: 0,
  },
};
