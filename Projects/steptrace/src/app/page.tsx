import Link from "next/link";

const personas = [
  {
    name: "Engineer",
    description: "Upload a work instruction, review the AI-parsed steps, and publish it.",
    href: "/engineer",
    enabled: true,
  },
  {
    name: "Technician",
    description: "Step-by-step guided execution with data capture. Coming in Phase 2.",
    href: "#",
    enabled: false,
  },
  {
    name: "Ops Lead",
    description: "First-pass yield, cycle time, and defect Pareto dashboard. Coming in Phase 3.",
    href: "#",
    enabled: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">StepTrace</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        AI-powered digital work instructions with built-in quality metrics. Pick a persona to
        get started.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {personas.map((persona) =>
          persona.enabled ? (
            <Link
              key={persona.name}
              href={persona.href}
              className="rounded-lg border border-neutral-300 bg-white p-6 shadow-sm transition hover:border-amber-500 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-neutral-900">{persona.name}</h2>
              <p className="mt-2 text-sm text-neutral-600">{persona.description}</p>
            </Link>
          ) : (
            <div
              key={persona.name}
              className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 opacity-60"
            >
              <h2 className="text-lg font-semibold text-neutral-500">{persona.name}</h2>
              <p className="mt-2 text-sm text-neutral-500">{persona.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
