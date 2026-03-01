import { SponsorBadges } from "@/components/sponsor-badges";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-black/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 md:px-6">
        <Link href="/" className="flex w-fit items-center gap-2 text-[var(--foreground)]">
          <Image
            src="https://media.discordapp.net/attachments/1477337414971428954/1477521362057695333/logo.png?ex=69a5107f&is=69a3beff&hm=5741a70d7b2c3736c2e0dfaf6cbbd1a8a520d72b0e37d10cc4fb8cd0be6d2adf&=&format=webp&quality=lossless&width=1382&height=922"
            alt="FrontierDispatch logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded object-contain"
          />
          <span className="text-sm font-medium">FrontierDispatch.tech</span>
        </Link>
        <SponsorBadges />
        <p className="text-sm text-[var(--muted)]">
          FrontierDispatch.tech - Infrastructure, logistics, and frontier systems
          modernization.
        </p>
      </div>
    </footer>
  );
}
