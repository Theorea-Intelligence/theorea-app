export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-light text-ink">Profile</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Your tea identity
        </p>
      </header>

      {/* Profile card */}
      <section className="rounded-soft border border-steam bg-porcelain p-6 shadow-whisper">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-parchment-warm text-ink-muted font-serif text-xl">
            K
          </div>
          <div>
            <h2 className="text-base font-medium text-ink">Kim</h2>
            <p className="text-sm text-ink-muted">Tea enthusiast</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Rituals logged", value: "12" },
          { label: "Teas explored", value: "2" },
          { label: "Days active", value: "7" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-soft border border-steam bg-porcelain p-5 text-center shadow-whisper"
          >
            <p className="font-serif text-2xl text-ink">{stat.value}</p>
            <p className="text-xs text-ink-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <section className="rounded-soft border border-steam bg-porcelain p-6 shadow-whisper">
        <h2 className="font-serif text-lg text-ink mb-4">Tea Preferences</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-steam">
            <span className="text-sm text-ink-light">Preferred types</span>
            <span className="text-sm text-ink">Oolong, Green</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-steam">
            <span className="text-sm text-ink-light">Flavour profile</span>
            <span className="text-sm text-ink">Floral, Mineral, Roasted</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-ink-light">Ritual style</span>
            <span className="text-sm text-ink">Gongfu</span>
          </div>
        </div>
      </section>

      {/* Settings links */}
      <section className="rounded-soft border border-steam bg-porcelain p-6 shadow-whisper">
        <h2 className="font-serif text-lg text-ink mb-4">Settings</h2>
        <ul className="space-y-1">
          {["Account", "Notifications", "Privacy", "Help & Support"].map(
            (item) => (
              <li key={item}>
                <button className="flex w-full items-center justify-between rounded-subtle px-3 py-2.5 text-sm text-ink-light hover:bg-parchment hover:text-ink transition-colors duration-gentle">
                  {item}
                  <span className="text-ink-muted">&rarr;</span>
                </button>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
