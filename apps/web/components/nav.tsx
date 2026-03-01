import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  { href: "/dispatch", label: "Dispatch AI" },
  { href: "/telegraph", label: "Telegraph Voice" },
  { href: "/ledger", label: "Ledger" },
  { href: "/log-run", label: "Log Run" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold tracking-wide text-white">
          FrontierDispatch.tech
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
