import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Théorea",
  description: "How Maison Théorea collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "20 May 2026";
const CONTACT_EMAIL = "privacy@maison-theorea.com";
const COMPANY = "Maison Théorea Ltd";
const COMPANY_REGISTERED = "England and Wales";

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{
        background: "linear-gradient(180deg, #EDE6DC 0%, #FAF8F5 40%, #F5F0EA 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1.5 text-[13px] mb-10"
          style={{ color: "rgba(58,48,40,0.50)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[11px] font-medium tracking-widest uppercase mb-3"
            style={{ color: "rgba(184,149,106,0.80)" }}
          >
            Legal
          </p>
          <h1
            className="text-[32px] font-medium text-ink mb-3"
            style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            Privacy Policy
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(58,48,40,0.50)" }}>
            Last updated {LAST_UPDATED}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-[15px] leading-relaxed" style={{ color: "rgba(58,48,40,0.80)" }}>

          <Section title="Who we are">
            <p>
              {COMPANY} is registered in {COMPANY_REGISTERED}. We operate the Théorea
              application and website (collectively, &ldquo;the Service&rdquo;). References to &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo; in this policy refer to {COMPANY}.
            </p>
            <p className="mt-3">
              Questions about this policy or your data may be directed to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="What data we collect">
            <p>We collect the following categories of personal data:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong className="font-medium">Account data</strong> — your name, email address, and authentication credentials when you register.</li>
              <li><strong className="font-medium">Profile data</strong> — tea preferences, flavour profile, ritual style, and any optional information you choose to provide.</li>
              <li><strong className="font-medium">Ritual logs</strong> — tea sessions you record, including brewing parameters, tasting notes, and mood reflections.</li>
              <li><strong className="font-medium">Conversation data</strong> — messages exchanged with Lou, our AI tea companion, to enable personalised recommendations.</li>
              <li><strong className="font-medium">Usage data</strong> — pages visited, features used, and interaction patterns, collected via Google Analytics 4.</li>
              <li><strong className="font-medium">Transaction data</strong> — order history and payment references (payment card details are processed by Stripe and never stored by us).</li>
              <li><strong className="font-medium">Device data</strong> — device type, operating system, and browser, collected automatically for technical compatibility.</li>
            </ul>
          </Section>

          <Section title="How we use your data">
            <p>We use your personal data to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Create and manage your account and authenticate your identity.</li>
              <li>Provide Lou&apos;s personalised tea recommendations based on your preferences and ritual history.</li>
              <li>Process marketplace orders and fulfil purchases.</li>
              <li>Improve the Service through aggregated usage analysis.</li>
              <li>Send service communications (account updates, order confirmations).</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We do not use your data for
              automated decision-making that produces legal effects.
            </p>
          </Section>

          <Section title="Legal basis for processing">
            <p>Under UK GDPR, we process your data under the following bases:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong className="font-medium">Contract</strong> — processing necessary to deliver the Service you have requested.</li>
              <li><strong className="font-medium">Legitimate interests</strong> — improving the Service and preventing fraud.</li>
              <li><strong className="font-medium">Consent</strong> — marketing communications (you may withdraw at any time).</li>
              <li><strong className="font-medium">Legal obligation</strong> — compliance with applicable law.</li>
            </ul>
          </Section>

          <Section title="Data sharing">
            <p>We share data only with trusted service providers who process it on our behalf:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong className="font-medium">Supabase</strong> — database and authentication infrastructure.</li>
              <li><strong className="font-medium">Anthropic</strong> — AI inference for Lou (conversation data is processed but not used to train Anthropic models per our agreement).</li>
              <li><strong className="font-medium">Stripe</strong> — payment processing.</li>
              <li><strong className="font-medium">Google Analytics</strong> — usage analytics.</li>
              <li><strong className="font-medium">Vercel</strong> — application hosting.</li>
              <li><strong className="font-medium">Google Cloud Platform</strong> — data storage and infrastructure.</li>
            </ul>
            <p className="mt-3">
              All processors are bound by data processing agreements. Where data is transferred
              outside the UK, appropriate safeguards (standard contractual clauses) are in place.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              We retain your account data for as long as your account remains active. Ritual logs
              and conversation data are retained indefinitely to maintain your personal history,
              unless you request deletion. Usage analytics are retained for 26 months per Google
              Analytics default settings.
            </p>
            <p className="mt-3">
              You may request deletion of your account and associated data at any time by
              contacting{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="Your rights">
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong className="font-medium">Access</strong> — request a copy of the data we hold about you.</li>
              <li><strong className="font-medium">Rectification</strong> — correct inaccurate data.</li>
              <li><strong className="font-medium">Erasure</strong> — request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong className="font-medium">Restriction</strong> — limit how we process your data in certain circumstances.</li>
              <li><strong className="font-medium">Portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong className="font-medium">Objection</strong> — object to processing based on legitimate interests.</li>
            </ul>
            <p className="mt-3">
              To exercise any right, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>. We will respond within one calendar month.
              You also have the right to lodge a complaint with the Information Commissioner&apos;s
              Office (ICO) at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#B8956A" }}>
                ico.org.uk
              </a>.
            </p>
          </Section>

          <Section title="Cookies and analytics">
            <p>
              We use Google Analytics 4 to understand how the Service is used. GA4 uses
              first-party cookies and does not use advertising identifiers. You may opt out
              of analytics by using the Google Analytics Opt-out Browser Add-on or by
              enabling a &ldquo;Do Not Track&rdquo; signal in your browser.
            </p>
            <p className="mt-3">
              We use a session cookie for authentication purposes. This cookie is strictly
              necessary for the Service to function and cannot be opted out of while using
              the app.
            </p>
          </Section>

          <Section title="Children">
            <p>
              The Service is not directed at children under the age of 13. We do not
              knowingly collect personal data from children. If you believe a child has
              provided data to us, please contact us immediately.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be
              communicated via the app or by email. The date at the top of this page
              reflects the most recent revision.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              {COMPANY}<br />
              Registered in {COMPANY_REGISTERED}<br />
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 flex gap-6" style={{ borderTop: "0.5px solid rgba(58,48,40,0.12)" }}>
          <Link href="/terms" className="text-[13px]" style={{ color: "rgba(58,48,40,0.50)" }}>
            Terms of Service
          </Link>
          <Link href="/welcome" className="text-[13px]" style={{ color: "rgba(58,48,40,0.50)" }}>
            Back to app
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-[18px] font-medium text-ink mb-4"
        style={{ letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
