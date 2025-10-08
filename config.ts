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
