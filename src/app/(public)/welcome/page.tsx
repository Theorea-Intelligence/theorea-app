export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-page">
      {/* Hero */}
      <section className="flex flex-col items-center text-center max-w-2xl mx-auto py-breath">
        <p className="text-ink-muted text-sm tracking-[0.2em] uppercase mb-6">
          Maison Théorea
        </p>

        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8">
          Tea as Ritual
        </h1>

        <p className="text-ink-light text-lg md:text-xl leading-relaxed mb-12 max-w-lg">
          A connoisseur-grade platform for those who believe tea is not a
          beverage — it is a practice. Discover exceptional teas, deepen your
          ritual, and connect with the world&apos;s finest sommeliers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-jade text-porcelain text-sm tracking-wide rounded-subtle transition-all duration-gentle hover:bg-jade-dark hover:shadow-soft"
          >
            Join the Waitlist
          </a>
          <a
            href="#discover"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-steam text-ink-light text-sm tracking-wide rounded-subtle transition-all duration-gentle hover:border-ink-muted hover:text-ink"
          >
            Discover More
          </a>
        </div>
      </section>

      {/* Philosophy */}
      <section
        id="discover"
        className="w-full max-w-3xl mx-auto py-section text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-8">
          Intelligence Through Stillness
        </h2>

        <p className="text-ink-light text-lg leading-relaxed mb-16">
          Théorea is where ancient tea wisdom meets modern intelligence. Our
          pocket tea sommelier, Lou, guides your journey — from your first steep
          to your thousandth. Every recommendation refined. Every ritual
          honoured.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Lou</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              Your pocket tea sommelier. A digital connoisseur who learns your
              palate, guides your brewing, and deepens your practice.
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Ritual</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              Track your tea journey. Log sessions, tasting notes, and
              mindfulness reflections. Build a living record of your practice.
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Marketplace</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              A curated collection of exceptional teas — from our signature Da
              Hong Pao and Jasmin Snow Buds to sommelier-selected treasures.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="w-full max-w-md mx-auto py-section text-center"
      >
        <h2 className="font-serif text-3xl font-light mb-4">
          Begin Your Ritual
        </h2>
        <p className="text-ink-muted text-sm mb-8">
          Join the waitlist for early access to Théorea.
        </p>

        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-porcelain border border-steam rounded-subtle text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-jade transition-colors duration-gentle"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-jade text-porcelain text-sm tracking-wide rounded-subtle transition-all duration-gentle hover:bg-jade-dark hover:shadow-soft"
          >
            Join
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto py-section border-t border-steam text-center">
        <p className="text-ink-muted text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Maison Théorea. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
