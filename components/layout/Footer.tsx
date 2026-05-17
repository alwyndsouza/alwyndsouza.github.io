import Link from "next/link";
import { Database, Rss, Github, Linkedin, FileText } from "lucide-react";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Writing" },
  { href: "/about", label: "About" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/alwyndsouza", label: "GitHub", icon: Github },
  { href: "https://linkedin.com/in/alwynanildsouza", label: "LinkedIn", icon: Linkedin },
  { href: "https://medium.com/@aradsouza", label: "Medium", icon: FileText },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Alwyn D'Souza — home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-600/20 transition-colors group-hover:bg-indigo-600/30">
                <Database className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">
                alwyn<span className="text-indigo-400">.dev</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-xs">
              Data &amp; AI Engineering Leader. Building modern data platforms,
              AI systems, and open-source developer tools.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in new tab)`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Site nav */}
          <nav aria-label="Footer navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Navigate
            </h2>
            <ul className="space-y-2.5" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Connect
            </h2>
            <ul className="space-y-2.5" role="list">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    {label}
                    <span className="text-zinc-700 text-xs" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-800/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-700">
            &copy; {year} Alwyn D&apos;Souza. Built with Next.js &amp; deployed on GitHub Pages.
          </p>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 transition-colors hover:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            aria-label="RSS feed"
          >
            <Rss className="h-3 w-3" aria-hidden="true" />
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  );
}
