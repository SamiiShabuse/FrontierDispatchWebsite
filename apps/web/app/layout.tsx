import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/nav";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "FrontierDispatch Mission Control",
  description:
    "Official FrontierDispatch.tech brand hub and mission control portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
