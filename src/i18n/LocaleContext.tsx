"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "./locales";
import { detectLocale, SUPPORTED_LOCALES } from "./locales";
import type { Messages } from "./messages/en";
import en from "./messages/en";
import fr from "./messages/fr";
import it from "./messages/it";
import zh from "./messages/zh";

const MESSAGES: Record<Locale, Messages> = { en, fr, it, zh };
const STORAGE_KEY = "theorea-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 1. Check saved preference
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      setLocaleState(saved);
      return;
    }
    // 2. Fall back to browser language
    const detected = detectLocale(navigator.language || "en");
    setLocaleState(detected);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: MESSAGES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
