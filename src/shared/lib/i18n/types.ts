import type en from "@/messages/en.json";
import type { LOCALES } from "@/shared/lib/i18n/constants";

export type Locale = (typeof LOCALES)[number];

export type Dictionary = typeof en;
