import { config } from "@config";
import { join } from "path";
import { compileStringAsync } from "sass";
import { expect } from "vitest";

/**
 * Utility functions for compiling SCSS/Sass source strings using custom configuration.
 */

/**
 * Compiles a given Sass/SCSS source string asynchronously using specified options and project configuration.
 *
 * @param source - The Sass/SCSS source code as a string to be compiled.
 * @param options - Optional configuration object to override or extend default compilation options.
 * @returns A Promise that resolves with the compilation result.
 * @throws Throws an error if the compilation fails.
 */
const compileSassString = async (source: string, options = {}) => {
  const sassPaths = [config.stylesDir, join(config.rootDir, "node_modules")];
  try {
    const result = await compileStringAsync(source, {
      loadPaths: sassPaths,
      silenceDeprecations: ["slash-div"],
      quietDeps: false,
      ...options,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Normalizes a CSS string by:
 * - Splitting it into lines,
 * - Trimming trailing whitespace from each line,
 * - Removing empty lines,
 * - Joining the lines back together with newline characters,
 * - Trimming leading and trailing whitespace from the final result.
 *
 * @param css - The CSS string to normalize.
 * @returns The normalized CSS string.
 */
const normalizeCSS = (css: string) =>
  css
    .replace(/\s+/g, " ")
    .replace(/\s?{\s?/g, " { ")
    .replace(/\s?}\s?/g, " }")
    .trim();

/**
 * Compiles a given Sass string and compares the resulting CSS to the expected CSS.
 *
 * @param sassString - The Sass code to compile.
 * @param expectedCSS - The expected CSS output after compilation.
 * @param options - Optional compilation options to pass to the Sass compiler.
 * @returns A promise that resolves when the compiled CSS matches the expected CSS.
 *
 * @throws Will throw an error if the compiled CSS does not match the expected CSS.
 */
export const testSass = async (
  sassString: string,
  expectedCSS: string,
  options = {}
) => {
  const result = await compileSassString(sassString, options);
  const compiledCSS = normalizeCSS(result.css);
  expect(compiledCSS).toBe(normalizeCSS(expectedCSS));
};
