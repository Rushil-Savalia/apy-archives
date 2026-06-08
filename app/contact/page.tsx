import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with APY Archives — questions, corrections, and suggestions are welcome.",
};

const CONTACT_EMAIL = "apyarchive@gmail.com";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Contact us
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          We&apos;d love to hear from you.
        </p>
      </header>

      <p className="text-gray-700 dark:text-gray-300 leading-7">
        Have a question, spotted a rate that looks off, or want to suggest a bank
        we should track? The best way to reach us is by email. We read every
        message and try to respond within a few business days.
      </p>

      <div className="mt-8 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Email us at
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-1 inline-block text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
        <div className="mt-6">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Send an email
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        We don&apos;t use a contact form and never ask for personal or financial
        information. For account-specific issues, please contact your bank
        directly — we&apos;re an independent project and can&apos;t access anyone&apos;s accounts.
      </p>
    </div>
  );
}
