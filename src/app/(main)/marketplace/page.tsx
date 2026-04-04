export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-light text-ink">
          Marketplace
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Exceptional teas, curated with intention
        </p>
      </header>

      {/* Search & filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search teas, origins, flavour profiles..."
          className="flex-1 rounded-subtle border border-steam bg-porcelain px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-jade transition-colors duration-gentle"
        />
        <button className="rounded-subtle border border-steam px-4 py-2.5 text-sm text-ink-muted hover:border-ink-muted hover:text-ink transition-colors duration-gentle">
          Filter
        </button>
      </div>

      {/* Tea grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Da Hong Pao",
            type: "Oolong",
            origin: "Wuyi Mountains, Fujian",
            profile: "Roasted chestnut, mineral, lingering sweetness",
            price: "£28",
            weight: "50g",
            badge: "Théorea",
          },
          {
            name: "Jasmin Snow Buds",
            type: "Green Tea, Scented",
            origin: "Fuding, Fujian",
            profile: "Jasmine blossom, clean, delicate",
            price: "£24",
            weight: "50g",
            badge: "Théorea",
          },
          {
            name: "Gyokuro Asahi",
            type: "Green Tea",
            origin: "Uji, Kyoto",
            profile: "Deep umami, marine, sweet finish",
            price: "—",
            weight: "—",
            badge: "Coming soon",
          },
          {
            name: "Aged Sheng Pu-erh",
            type: "Pu-erh",
            origin: "Yunnan",
            profile: "Earthy, dried fruit, complex layers",
            price: "—",
            weight: "—",
            badge: "Coming soon",
          },
          {
            name: "Ali Shan High Mountain",
            type: "Oolong",
            origin: "Chiayi, Taiwan",
            profile: "Buttery, floral, cream",
            price: "—",
            weight: "—",
            badge: "Coming soon",
          },
          {
            name: "Silver Needle",
            type: "White Tea",
            origin: "Fuding, Fujian",
            profile: "Hay, melon, silky texture",
            price: "—",
            weight: "—",
            badge: "Coming soon",
          },
        ].map((tea, i) => (
          <article
            key={i}
            className="group rounded-soft border border-steam bg-porcelain p-5 shadow-whisper hover:shadow-soft transition-all duration-gentle cursor-pointer"
          >
            {/* Placeholder image area */}
            <div className="aspect-[4/3] rounded-subtle bg-parchment-warm mb-4 flex items-center justify-center">
              <span className="text-3xl text-steam">茶</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-base text-ink group-hover:text-jade-dark transition-colors duration-gentle">
                  {tea.name}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">{tea.type}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                  tea.badge === "Théorea"
                    ? "bg-jade/10 text-jade"
                    : "bg-steam text-ink-muted"
                }`}
              >
                {tea.badge}
              </span>
            </div>

            <p className="text-xs text-ink-muted mt-1">{tea.origin}</p>
            <p className="text-sm text-ink-light mt-2 leading-relaxed">
              {tea.profile}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-steam">
              <span className="text-sm font-medium text-ink">{tea.price}</span>
              {tea.weight !== "—" && (
                <span className="text-xs text-ink-muted">{tea.weight}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
