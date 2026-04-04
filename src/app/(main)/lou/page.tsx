export default function LouPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="pb-6 border-b border-steam">
        <h1 className="font-serif text-2xl font-light text-ink">Lou</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Your pocket tea sommelier
        </p>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jade/10 text-jade mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-ink mb-2">
          What shall we explore?
        </h2>
        <p className="text-sm text-ink-muted text-center max-w-sm">
          Ask me about tea varieties, brewing techniques, flavour profiles, or
          let me guide you through a mindful tea ritual.
        </p>
      </div>

      {/* Input area */}
      <div className="border-t border-steam pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask Lou anything about tea..."
            className="flex-1 rounded-soft border border-steam bg-porcelain px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-jade transition-colors duration-gentle"
          />
          <button className="rounded-soft bg-jade px-5 py-3 text-sm text-porcelain hover:bg-jade-dark transition-colors duration-gentle">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
