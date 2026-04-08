export default function RitualsPage() {
  return (
    <div className="space-y-4">
      {/* Header — compact */}
      <header className="flex items-center justify-between animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink">Rituals</h1>
        <button className="flex items-center gap-1.5 rounded-2xl bg-ink px-4 py-2 text-[13px] font-medium text-porcelain active:scale-[0.97] transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log
        </button>
      </header>

      {/* Ritual list — grouped card */}
      <section className="rounded-2xl bg-porcelain shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-100">
        <div className="divide-y divide-black/[0.04]">
          {[
            {
              tea: "Da Hong Pao",
              date: "Today, 10:30",
              temp: "95°C",
              steepTime: "45s",
              notes: "Roasted chestnut, lingering sweetness. A grounding start to the day.",
              mood: "Focused",
            },
            {
              tea: "Jasmin Snow Buds",
              date: "Yesterday, 16:00",
              temp: "80°C",
              steepTime: "2 min",
              notes: "Floral, clean, meditative. The jasmine opened beautifully in the second steep.",
              mood: "Calm",
            },
            {
              tea: "Da Hong Pao",
              date: "2 Apr, 09:15",
              temp: "95°C",
              steepTime: "40s",
              notes: "Rich mineral body, calm focus. Five infusions, each one different.",
              mood: "Present",
            },
          ].map((ritual, i) => (
            <div
              key={i}
              className="px-4 py-3.5 active:bg-parchment transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-ink">{ritual.tea}</p>
                  <span className="text-[10px] px-1.5 py-[1px] rounded-full bg-jade/8 text-jade-dark font-medium">
                    {ritual.mood}
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted/50 shrink-0 ml-3">{ritual.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-1.5">
                <span>{ritual.temp}</span>
                <span>&middot;</span>
                <span>{ritual.steepTime}</span>
              </div>
              <p className="text-[13px] text-ink-light leading-relaxed line-clamp-2">
                {ritual.notes}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
