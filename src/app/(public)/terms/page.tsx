import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Théorea",
  description: "Terms and conditions for using the Théorea application.",
};

const LAST_UPDATED = "20 May 2026";
const CONTACT_EMAIL = "legal@maison-theorea.com";
const COMPANY = "Maison Théorea Ltd";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(58,48,40,0.50)" }}>
            Last updated {LAST_UPDATED}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-[15px] leading-relaxed" style={{ color: "rgba(58,48,40,0.80)" }}>

          <Section title="Acceptance">
            <p>
              By accessing or using the Théorea application (&ldquo;the Service&rdquo;), you agree to be
              bound by these Terms of Service and our{" "}
              <Link href="/privacy" className="underline" style={{ color: "#B8956A" }}>
                Privacy Policy
              </Link>
              . If you do not agree, please do not use the Service.
            </p>
            <p className="mt-3">
              The Service is provided by {COMPANY}, registered in England and Wales.
            </p>
          </Section>

          <Section title="The Service">
            <p>Théorea provides:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Lou, an AI-powered tea companion that offers personalised tea recommendations and brewing guidance.</li>
              <li>A ritual tracker to log and reflect on your tea sessions.</li>
              <li>A curated marketplace for premium teas from verified sellers.</li>
              <li>A community platform for tea sommeliers and enthusiasts.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the Service
              at any time with reasonable notice.
            </p>
          </Section>

          <Section title="Account registration">
            <p>
              You must be at least 13 years of age to create an account. You are responsible
              for maintaining the confidentiality of your credentials and for all activity
              that occurs under your account. Please notify us immediately of any unauthorised
              use at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="Lou — AI tea companion">
            <p>
              Lou is powered by large language model technology. While Lou draws on deep tea
              knowledge, its responses are for informational and experiential purposes only.
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Lou does not provide medical, nutritional, or health advice. Nothing Lou communicates should be taken as a substitute for professional medical guidance.</li>
              <li>Lou may occasionally make errors. We do not guarantee the accuracy of AI-generated content.</li>
              <li>Conversations with Lou are stored to improve personalisation. See our Privacy Policy for details.</li>
            </ul>
          </Section>

          <Section title="Marketplace">
            <p>
              The Théorea marketplace connects buyers with verified tea sellers. When you
              make a purchase:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Payments are processed securely by Stripe. We do not store payment card details.</li>
              <li>Th&eacute;orea&apos;s own products (Da Hong Pao, Jasmin Snow Buds) are sold directly by {COMPANY}.</li>
              <li>Third-party products are sold by the listed seller. {COMPANY} acts as an intermediary and is not responsible for third-party product quality beyond our verification process.</li>
              <li>Returns and refunds are handled in accordance with UK consumer law.</li>
            </ul>
          </Section>

          <Section title="User content">
            <p>
              You may submit tasting notes, reviews, and other content (&ldquo;User Content&rdquo;). By
              submitting User Content you grant us a non-exclusive, royalty-free, worldwide
              licence to display and distribute it within the Service.
            </p>
            <p className="mt-3">You must not submit content that is:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>False, misleading, or defamatory.</li>
              <li>Infringing of any third-party intellectual property rights.</li>
              <li>Offensive, discriminatory, or harmful.</li>
              <li>Spam or unsolicited commercial communications.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove User Content that violates these terms without notice.
            </p>
          </Section>

          <Section title="Sommelier accounts">
            <p>
              Tea sommeliers and experts may apply for verified status to list teas and publish
              content on the marketplace. Verification is at our sole discretion. Verified
              sellers agree to additional terms provided at the time of onboarding, including
              product quality standards, commission rates, and fulfilment obligations.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              All content, design, trademarks, and technology in the Service are owned by
              or licensed to {COMPANY}. You may not reproduce, distribute, or create derivative
              works without our written permission.
            </p>
            <p className="mt-3">
              &ldquo;Théorea&rdquo;, &ldquo;Maison Théorea&rdquo;, and &ldquo;Lou&rdquo; are trademarks of {COMPANY}.
              Trademark registration is pending.
            </p>
          </Section>

          <Section title="Prohibited conduct">
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
              <li>Scrape, crawl, or extract data from the Service by automated means without written permission.</li>
              <li>Interfere with the integrity or performance of the Service.</li>
              <li>Impersonate any person or entity.</li>
            </ul>
          </Section>

          <Section title="Disclaimers and limitation of liability">
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied.
              To the fullest extent permitted by law, {COMPANY} excludes liability for indirect,
              incidental, or consequential losses arising from your use of the Service.
            </p>
            <p className="mt-3">
              Nothing in these terms limits liability for death or personal injury caused by
              negligence, fraud, or any other liability that cannot be excluded under English law.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall
              be subject to the exclusive jurisdiction of the English courts.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms from time to time. Continued use of the Service after
              changes constitutes acceptance of the revised terms. Material changes will be
              communicated with reasonable notice via the app or email.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              {COMPANY}<br />
              Registered in England and Wales<br />
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#B8956A" }}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 flex gap-6" style={{ borderTop: "0.5px solid rgba(58,48,40,0.12)" }}>
          <Link href="/privacy" className="text-[13px]" style={{ color: "rgba(58,48,40,0.50)" }}>
            Privacy Policy
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
