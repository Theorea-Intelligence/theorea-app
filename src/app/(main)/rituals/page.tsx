export default function RitualsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-ink">Rituals</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Your tea journal — every steep, every reflection
          </p>
        </div>
        <button className="rounded-subtle bg-jade px-4 py-2.5 text-sm text-porcelain hover:bg-jade-dark transition-colors duration-gentle">
          Log a ritual
        </button>
      </header>

      {/* Ritual entries */}
      <div className="space-y-4">
        {[
          {
            tea: "Da Hong Pao",
            date: "4 April 2026, 10:30",
            temp: "95°C",
            steepTime: "45s first infusion",
            notes: "Roasted chestnut, lingering sweetness. A grounding start to the day.",
            mood: "Focused",
          },
          {
            tea: "Jasmin Snow Buds",
            date: "3 April 2026, 16:00",
            temp: "80°C",
            steepTime: "2 minutes",
            notes: "Floral, clean, meditative. The jasmine opened beautifully in the second steep.",
            mood: "Calm",
          },
          {
            tea: "Da Hong Pao",
            date: "2 April 2026, 09:15",
            temp: "95°C",
            steepTime: "40s first infusion",
            notes: "Rich mineral body, calm focus. Five infusions, each one different.",
            mood: "Present",
          },
        ].map((ritual, i) => (
          <article
            key={i}
            className="rounded-soft border border-steam bg-porcelain p-6 shadow-whisper hover:shadow-soft transition-shadow duration-gentle cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg text-ink">{ritual.tea}</h3>
                <p className="text-xs text-ink-muted mt-1">{ritual.date}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-jade/10 text-jade">
                {ritual.mood}
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-ink-muted">
              <span>{ritual.temp}</span>
              <span>&middot;</span>
              <span>{ritual.steepTime}</span>
            </div>
            <p className="mt-3 text-sm text-ink-light leading-relaxed">
              {ritual.notes}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
