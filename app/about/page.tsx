import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & Privacy",
  description:
    "What APY Archives is, how we source rate data, our disclaimer, and our privacy policy.",
};

const CONTACT_EMAIL = "apyarchive@gmail.com";

function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="flex items-center gap-2.5 scroll-mt-20 mt-12 mb-4 first:mt-0">
      <span className="h-6 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {children}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          About &amp; Privacy
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Who we are, how we get our data, and how we handle yours.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-600 dark:text-blue-400">
          <a href="#about" className="hover:underline">About</a>
          <a href="#methodology" className="hover:underline">Methodology</a>
          <a href="#disclaimer" className="hover:underline">Disclaimer</a>
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
        </nav>
      </header>

      <div className="text-gray-700 dark:text-gray-300 leading-7">
        <SectionHeading id="about">About APY Archives</SectionHeading>
        <p className="my-4">
          APY Archives is an independent project that tracks the{" "}
          <strong className="font-semibold text-gray-900 dark:text-gray-100">historical APY</strong>{" "}
          of popular high-yield savings accounts and charts how those rates have
          moved over time. Most rate comparison sites only show you today&apos;s
          number. We think the more useful question is how a rate has{" "}
          <em>behaved</em> — whether a bank holds its rate steady or launches high
          and quietly drifts down.
        </p>
        <p className="my-4">
          The goal is simple: give savers a clear, honest, long-term view so they
          can choose an account based on its track record, not just a headline.
        </p>

        <SectionHeading id="methodology">How we source our data</SectionHeading>
        <p className="my-4">
          Our rate history is compiled from publicly available rate-history data
          published by various websites, stored as a dataset that this site
          reads directly. Each data point represents a rate-change event — the date
          a given account&apos;s APY changed — which lets us reconstruct the full
          curve over several years.
        </p>
        <p className="my-4">
          We occasionally apply manual corrections when an upstream data point is
          clearly wrong, and we note the current rate for each account based on the
          most recent change we have on record. Data can lag, contain errors, or
          differ from what a bank is currently advertising.
        </p>

        <SectionHeading id="disclaimer">Disclaimer</SectionHeading>
        <p className="my-4">
          APY Archives is for{" "}
          <strong className="font-semibold text-gray-900 dark:text-gray-100">informational and educational purposes only</strong>{" "}
          and is <strong className="font-semibold text-gray-900 dark:text-gray-100">not financial advice</strong>.
          We are not a bank, a broker, or a financial advisor, and nothing here is
          a recommendation to open, keep, or close any account.
        </p>
        <p className="my-4">
          Interest rates change frequently and account terms vary. Always verify
          the current APY, eligibility requirements, and fees directly with the
          financial institution before making any decision. Any opinions expressed
          in our blog are our own views based on the data we track.
        </p>

        <SectionHeading id="privacy">Privacy Policy</SectionHeading>
        <p className="my-4 text-sm text-gray-500 dark:text-gray-400">
          Last updated: June 7, 2026
        </p>
        <p className="my-4">
          We aim to collect as little as possible. APY Archives has no user
          accounts, no logins, and no sign-up forms.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Information we collect
        </h3>
        <p className="my-4">
          We do not ask you for any personal information to use this site. We do
          not sell or share personal data, because we do not collect it.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Analytics
        </h3>
        <p className="my-4">
          We use Vercel Analytics to understand aggregate, anonymous traffic
          patterns (such as which pages are visited). It is privacy-friendly and
          does not build advertising profiles of individual visitors.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Cookies and local storage
        </h3>
        <p className="my-4">
          We do not use advertising or tracking cookies. The only thing we store on
          your device is your light/dark theme preference, saved in your
          browser&apos;s local storage so the site remembers your choice. It stays
          on your device and is not sent to us.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          External links
        </h3>
        <p className="my-4">
          Our pages may link to banks and other third-party websites. Those sites
          have their own privacy practices, and we are not responsible for them.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Children&apos;s privacy
        </h3>
        <p className="my-4">
          This site is intended for a general, adult audience and is not directed
          at children under 13.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Changes and contact
        </h3>
        <p className="my-4">
          We may update this policy from time to time; the &quot;last updated&quot;
          date above reflects the latest revision. Questions about privacy or
          anything else? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>.
        </p>
      </div>
    </div>
  );
}
