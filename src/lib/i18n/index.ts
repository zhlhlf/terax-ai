import { useSyncExternalStore } from "react";
import { en } from "./locales/en";
import { zhCN } from "./locales/zh-CN";

/**
 * Minimal, dependency-free i18n. Flat dot-notation keys, two dictionaries
 * (`en` is the source of truth; `zh-CN` must satisfy its shape).
 *
 * `t()` is callable outside React (toasts, imperative helpers), so the active
 * language lives in a module variable. `useT()` subscribes via
 * `useSyncExternalStore` so components re-render on a language switch.
 */

export type Language = "zh-CN" | "en";

export const LANGUAGES: Language[] = ["zh-CN", "en"];

/** Language names are written in their own language and never translated. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  "zh-CN": "简体中文",
  en: "English",
};

export const DEFAULT_LANGUAGE: Language = "zh-CN";

export type TranslationKey = keyof typeof en;

export type TranslationParams = Record<string, string | number>;

/** Signature of the translator, for helpers that take `t` as a parameter. */
export type TFn = (key: TranslationKey, params?: TranslationParams) => string;

const DICTIONARIES: Record<Language, Record<string, string>> = {
  en,
  "zh-CN": zhCN,
};

let currentLanguage: Language = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(language: Language): void {
  if (language === currentLanguage) return;
  currentLanguage = language;
  for (const listener of listeners) listener();
}

/** Called once at boot from the preferences store. Sets the authoritative
 *  language and notifies so a hydrated value that differs from the default
 *  (e.g. the user chose English) re-renders already-mounted components. */
export function initI18n(language: Language): void {
  if (language === currentLanguage) return;
  currentLanguage = language;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Language {
  return currentLanguage;
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  const dict = DICTIONARIES[currentLanguage];
  let value = dict[key] ?? en[key];
  if (value === undefined) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] missing translation key: ${key}`);
    }
    return key;
  }
  if (params) {
    value = value.replace(/\{(\w+)\}/g, (match, name: string) =>
      params[name] !== undefined ? String(params[name]) : match,
    );
  }
  return value;
}

/** Reactive translator. Components using this re-render when the language
 *  changes. */
export function useT(): TFn {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return t;
}
