"use client";

import { useLocale } from "@/i18n/LocaleContext";

export default function MarketplacePage() {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink">{t.marketplace.title}</h1>
        <p className="text-[12px] text-ink-muted mt-0.5">{t.marketplace.subtitle}</p>
      </header>

      {/* Search */}
      <div className="animate-fade-in-up animation-delay-100">
        <div className="flex items-center gap-2 rounded-2xl bg-porcelain px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted/40 shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={t.marketplace.searchPlaceholder}
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Available teas */}
      <section className="space-y-3 animate-fade-in-up animation-delay-200">
        <h2 className="text-[11px] font-medium text-ink-muted uppercase tracking-wider px-1">{t.marketplace.available}</h2>
        {[
          {
            name: "Da Hong Pao",
            type: t.marketplace.oolong,
            origin: "Wuyi, Fujian",
            profile: "Roasted chestnut, mineral, lingering sweetness",
            price: "£28",
            weight: "50g",
          },
          {
            name: "Jasmin Snow Buds",
            type: t.marketplace.greenTeaScented,
            origin: "Fuding, Fujian",
            profile: "Jasmine blossom, clean, delicate",
            price: "£24",
            weight: "50g",
          },
        ].map((tea, i) => (
          <div
            key={i}
            className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-medium text-ink">{tea.name}</p>
                  <span className="text-[10px] px-1.5 py-[1px] rounded-full bg-jade/8 text-jade-dark font-medium">{t.marketplace.theorea}</span>
                </div>
                <p className="text-[12px] text-ink-muted mt-0.5">{tea.type} &middot; {tea.origin}</p>
                <p className="text-[13px] text-ink-light mt-2 leading-relaxed">{tea.profile}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[15px] font-medium text-ink">{tea.price}</span>
              <span className="text-[12px] text-ink-muted">{tea.weight}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Coming soon */}
      <section className="rounded-2xl bg-porcelain shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-300">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">{t.marketplace.comingSoon}</h2>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { name: "Gyokuro Asahi", type: t.marketplace.greenTea, origin: "Uji, Kyoto" },
            { name: "Aged Sheng Pu-erh", type: t.marketplace.puerh, origin: "Yunnan" },
            { name: "Ali Shan High Mountain", type: t.marketplace.oolong, origin: "Chiayi, Taiwan" },
            { name: "Silver Needle", type: t.marketplace.whiteTea, origin: "Fuding, Fujian" },
          ].map((tea, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{tea.name}</p>
                <p className="text-[11px] text-ink-muted mt-0.5">{tea.type} &middot; {tea.origin}</p>
              </div>
              <span className="text-[11px] text-ink-muted/50 shrink-0 ml-3">{t.marketplace.notifyMe}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
