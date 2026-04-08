import LouOrb from "@/components/ui/LouOrb";

export default function LouPage() {
  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-4rem)]">
      {/* Chat area — empty state */}
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
        {/* Breathing dual-leaf orb */}
        <div className="mb-6">
          <LouOrb variant="chat" />
        </div>

        <h2 className="font-serif text-[18px] font-light text-ink mb-1.5">
          What shall we explore?
        </h2>
        <p className="text-[13px] text-ink-muted text-center max-w-[260px] leading-relaxed">
          Tea varieties, brewing techniques, flavour profiles, or a mindful ritual.
        </p>

        {/* Quick suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-[300px]">
          {["Brew Da Hong Pao", "Compare oolongs", "Evening wind-down"].map((chip) => (
            <button
              key={chip}
              className="px-3.5 py-2 rounded-2xl bg-porcelain text-[12px] text-ink-muted shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-transform duration-200"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input area — iMessage style */}
      <div className="pt-2 pb-1 animate-fade-in-up animation-delay-200">
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-center rounded-2xl bg-porcelain px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <input
              type="text"
              placeholder="Ask Lou anything..."
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted/50 focus:outline-none"
            />
          </div>
          <button className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oolong to-oolong-dark active:scale-[0.93] transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain translate-x-[1px]">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
