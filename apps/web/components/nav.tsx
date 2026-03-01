import Link from "next/link";
import Image from "next/image";

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
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-1 text-[var(--foreground)] transition hover:bg-black/5"
        >
          <Image
            src="https://media.discordapp.net/attachments/1477337414971428954/1477521362057695333/logo.png?ex=69a5107f&is=69a3beff&hm=5741a70d7b2c3736c2e0dfaf6cbbd1a8a520d72b0e37d10cc4fb8cd0be6d2adf&=&format=webp&quality=lossless&width=1382&height=922"
            alt="FrontierDispatch logo"
            width={34}
            height={34}
            className="h-8 w-8 rounded-md object-contain"
            priority
          />
          <span className="font-semibold tracking-wide">FrontierDispatch.tech</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 hover:bg-black/5 hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
