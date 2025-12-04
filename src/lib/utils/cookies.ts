"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

/**
 * Retrieve the value of a cookie by key from the cookie store.
 *
 * This asynchronous helper obtains the cookie store (via `cookies()`) and
 * returns the value of the cookie with the given `key`. If the cookie does
 * not exist, the promise resolves to `null`.
 *
 * @param key - The name of the cookie to read.
 * @returns A promise that resolves to the cookie value as a string, or `null` if not found.
 *
 * @example
 * const sessionId = await getCookie('session_id');
 * if (sessionId) {
 *   // use sessionId
 * }
 */
export const getCookie = async (key: string) => {
  const store = await cookies();
  const cookie = store.get(key);
  return cookie?.value ?? null;
};

/**
 * Sets a cookie in the application's cookie store.
 *
 * This asynchronous utility obtains the current cookie store (via `cookies()`)
 * and sets the provided `ResponseCookie` options into that store.
 *
 * @param options - The cookie descriptor to set; should conform to the `ResponseCookie` type.
 * @returns A promise that resolves when the cookie has been written to the store.
 * @throws May propagate errors thrown when obtaining the cookie store or when setting the cookie.
 */
export const setCookie = async (options: ResponseCookie) => {
  const store = await cookies();
  store.set(options);
};
