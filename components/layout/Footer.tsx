import Link from "next/link";
import { Database } from "lucide-react";

const LINKS = {
  work: [
    { href: "/projects", label: "Projects" },
    { href: "/articles", label: "Writing" },
    { href: "/about", label: "About" },
  ],
  connect: [
    { href: "https://github.com/alwyndsouza", label: "GitHub", external: true },
    {
      href: "https://linkedin.com/in/alwyndsouza",
      label: "LinkedIn",
      external: true,
    },
    {
      href: "https://medium.com/@aradsouza",
      label: "Medium",
      external: true,
    },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600/20 border border-indigo-500/30">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">
                alwyn<span className="text-indigo-400">.dev</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Data & AI Engineering Leader. Building modern data platforms,
              AI systems, and developer tools.
            </p>
          </div>

          {/* Work */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Work
            </h4>
            <ul className="space-y-2">
              {LINKS.work.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Connect
            </h4>
            <ul className="space-y-2">
              {LINKS.connect.map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                    >
                      {label}
                      <span className="text-zinc-600 text-xs">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {year} Alwyn D&apos;Souza. Built with Next.js & deployed on GitHub Pages.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/rss.xml"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              RSS Feed
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
