import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          StepTrace
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/engineer" className="hover:text-amber-400">
            Engineer
          </Link>
          <span className="cursor-not-allowed text-neutral-600" title="Coming in Phase 2">
            Technician
          </span>
          <span className="cursor-not-allowed text-neutral-600" title="Coming in Phase 3">
            Ops Dashboard
          </span>
        </nav>
      </div>
    </header>
  );
}
