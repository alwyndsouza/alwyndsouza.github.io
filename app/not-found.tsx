import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-xs font-mono text-indigo-400 mb-4">404</p>
        <h1 className="text-3xl font-bold text-zinc-100 mb-3">
          Page not found
        </h1>
        <p className="text-zinc-500 mb-8 max-w-sm">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
