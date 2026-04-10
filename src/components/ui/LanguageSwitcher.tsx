"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger row — styled as a settings row */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3.5 active:bg-parchment transition-colors"
      >
        <span className="text-[14px] text-ink">{t.profile.language}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-ink-muted">
            {LOCALE_FLAGS[locale]} {LOCALE_LABELS[locale]}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-ink-muted/30 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="mx-4 mb-2 rounded-2xl bg-parchment overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {SUPPORTED_LOCALES.map((lang: Locale) => (
            <button
              key={lang}
              onClick={() => {
                setLocale(lang);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-[14px] transition-colors active:bg-porcelain ${
                locale === lang
                  ? "text-ink font-medium"
                  : "text-ink-muted"
              }`}
            >
              <span>
                {LOCALE_FLAGS[lang]} {LOCALE_LABELS[lang]}
              </span>
              {locale === lang && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-jade"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
