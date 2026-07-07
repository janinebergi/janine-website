import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, type Lang } from "@/lib/i18n-constants";

export type { Lang };
export { LANG_COOKIE, DEFAULT_LANG };

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LANG;
}
