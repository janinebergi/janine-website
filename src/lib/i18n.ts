import { cookies } from "next/headers";

export type Lang = "de" | "en";

export const LANG_COOKIE = "lang";
export const DEFAULT_LANG: Lang = "de";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LANG;
}
