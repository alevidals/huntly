import "server-only";

import { cache } from "react";
import type { Dictionary, Locale } from "@/shared/lib/i18n/types";

type GetDictionaryParams = {
  locale: Locale;
};

const dictionaries = {
  en: () => import("@/messages/en.json").then((mod) => mod.default),
  es: () => import("@/messages/es.json").then((mod) => mod.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

const getCachedDictionary = cache(async (locale: Locale) =>
  dictionaries[locale](),
);

export async function getDictionary({ locale }: GetDictionaryParams) {
  return getCachedDictionary(locale);
}
