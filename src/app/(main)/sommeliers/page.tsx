export default function SommeliersPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-light text-ink">
          Sommeliers
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Connect with tea masters and connoisseurs
        </p>
      </header>

      {/* Coming soon state */}
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-oolong/10 text-oolong mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-ink mb-2">
          The community is brewing
        </h2>
        <p className="text-sm text-ink-muted max-w-md leading-relaxed">
          Soon, tea sommeliers and experts will share their knowledge here —
          publishing tasting notes, curating collections, and guiding your
          palate. A contemplative space for those who take tea seriously.
        </p>
        <button className="mt-6 rounded-subtle border border-steam px-5 py-2.5 text-sm text-ink-muted hover:border-jade hover:text-jade transition-colors duration-gentle">
          Notify me when it launches
        </button>
      </section>
    </div>
  );
}
