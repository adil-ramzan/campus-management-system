import React from "react";
import { PROGRAM_GROUPS } from "../data/programs";
import { cardClass } from "./ui";

// The full list of bachelor programs, shown on both the Academics and Admissions pages.
function ProgramCatalog() {
  return (
    <div className="space-y-10">
      {PROGRAM_GROUPS.map((group) => (
        <div key={group.title}>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
            <p className="shrink-0 text-sm text-ink-secondary">
              {group.programs.length} program{group.programs.length === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.programs.map((program) => (
              <li key={program.name} className={`${cardClass} p-5 transition-colors hover:border-primary/40`}>
                <h4 className="text-base font-semibold leading-snug text-ink">{program.name}</h4>
                <dl className="mt-3 space-y-1.5 text-sm">
                  {program.details.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-secondary">{label}</dt>
                      <dd className="text-right font-medium text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ProgramCatalog;
