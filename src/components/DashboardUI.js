// Small presentational pieces and formatting helpers shared by the dashboard pages.
import React from "react";
import { Link } from "react-router-dom";
import { Alert, ErrorState, TextLink, cardClass, focusRing } from "./ui";

export { EmptyState } from "./ui";

export const asArray = (value) => (Array.isArray(value) ? value : []);
export const formatNumber = (value) => Number(value || 0).toLocaleString();
export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

export const toTime = (value) => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

export const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function timeAgo(time) {
  const minutes = Math.round((Date.now() - time) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (time) => new Date(new Date(time).toDateString()).getTime();
const daysBetween = (from, to) => Math.round((startOfDay(to) - startOfDay(from)) / DAY);

// "Today", "Yesterday" or a short date, for events that only have a day.
export function dayLabel(time) {
  const days = daysBetween(time, Date.now());
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function dueLabel(time) {
  const days = daysBetween(Date.now(), time);
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export function Panel({ id, title, subtitle, action, className = "", children }) {
  return (
    <section id={id} className={`flex min-w-0 flex-col ${cardClass} ${className}`}>
      <header className="flex items-start justify-between gap-4 px-5 pt-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink-secondary">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="flex min-w-0 flex-1 flex-col p-5">{children}</div>
    </section>
  );
}

export function PanelLink({ to, children }) {
  return (
    <TextLink to={to} className="shrink-0 text-sm">
      {children}
    </TextLink>
  );
}

export function StatCard({ icon: Icon, label, value, caption }) {
  return (
    <div className={`${cardClass} min-w-0 p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-secondary">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-ink-secondary">{caption}</p>
    </div>
  );
}

// The row of shortcut tiles under the stat cards. `columns` sets the widest layout.
export function QuickActions({ actions, columns = "lg:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${columns}`}>
      {actions.map(({ label, to, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          className={`flex min-w-0 flex-col items-start gap-2 rounded-lg border border-line px-3 py-3 text-sm font-medium text-ink transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary-hover xl:flex-row xl:items-center xl:gap-3 xl:px-4 ${focusRing}`}
        >
          <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Meter({ label, value, detail }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-ink">{label}</span>
        <span className="shrink-0 font-medium text-ink">{detail || `${value}%`}</span>
      </div>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-page"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  const block = `animate-pulse ${cardClass}`;
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${block} h-32 p-5`}>
            <div className="h-3 w-20 rounded bg-page" />
            <div className="mt-5 h-7 w-16 rounded bg-page" />
            <div className="mt-3 h-3 w-28 rounded bg-page" />
          </div>
        ))}
      </div>
      <div className={`${block} h-24`} />
      <div className="grid gap-6 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${block} h-64`} />
        ))}
      </div>
    </div>
  );
}

export function DashboardError({ onRetry }) {
  return (
    <ErrorState
      title="The dashboard could not be loaded"
      message="The server returned an error. Check that you are still signed in, then try again."
      onRetry={onRetry}
    />
  );
}

export function DashboardNotice({ children }) {
  return <Alert tone="warning">{children}</Alert>;
}
