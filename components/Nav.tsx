"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/ai-sort", label: "AI Sort" },
  { href: "/eco-track", label: "EcoTrack" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "О системе" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-codium text-ivory">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Loom
        </Link>
        <div className="flex gap-2">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-peach text-codium"
                    : "text-ivory/80 hover:bg-bistre/30 hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
