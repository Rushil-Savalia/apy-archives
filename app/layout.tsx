import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://apyarchives.com"),
  title: {
    default: "APY Archives — Track High-Yield Savings Account Rate History",
    template: "%s — APY Archives",
  },
  description:
    "See how high-yield savings account APYs have changed over the years. Compare banks on real rate history, not just today's headline rate.",
  openGraph: {
    title: "APY Archives",
    description: "Historical APY data for high-yield savings accounts.",
    url: "https://apyarchives.com",
    siteName: "APY Archives",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APY Archives",
    description: "Historical APY data for high-yield savings accounts.",
  },
  other: {
    "google-adsense-account": "ca-pub-3358581619818600",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before paint to avoid a flash. Defaults to
            light mode; only an explicit saved 'dark' choice enables dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
