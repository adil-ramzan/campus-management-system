// The shared interface kit: buttons, cards, form controls, tables, badges, alerts and the
// loading, empty and error states. Pages compose these so every screen looks like one product.
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/* ---------- Buttons ---------- */

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

const BUTTON_VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-page",
  danger: "bg-danger text-white hover:bg-danger/90",
  dangerQuiet: "border border-line bg-surface text-danger hover:border-danger/40 hover:bg-danger/10",
};

const BUTTON_SIZES = { md: "h-10 px-4", sm: "h-8 px-3", icon: "h-9 w-9" };

export const buttonClass = (variant = "primary", size = "md", extra = "") =>
  `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`;

export function Spinner({ className = "h-4 w-4" }) {
  return (
    <span
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

// Renders a router link when given `to`, an anchor when given `href`, otherwise a button.
export function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  icon: Icon,
  loading = false,
  loadingLabel,
  className = "",
  children,
  ...props
}) {
  const classes = buttonClass(variant, size, className);
  const content = (
    <>
      {loading ? <Spinner /> : Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {loading && loadingLabel ? loadingLabel : children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={classes} disabled={loading || props.disabled} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}

export function TextLink({ to, className = "", children, ...props }) {
  return (
    <Link
      to={to}
      className={`rounded font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline ${focusRing} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

/* ---------- Surfaces ---------- */

export const cardClass = "rounded-xl border border-line bg-surface";

export function Card({ as: Tag = "div", padded = true, className = "", children, ...props }) {
  return (
    <Tag className={`${cardClass} ${padded ? "p-5 sm:p-6" : ""} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

// A card with a titled header row, for grouping a form or a list.
export function SectionCard({ title, description, action, className = "", children }) {
  return (
    <section className={`${cardClass} ${className}`}>
      <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-secondary">{description}</p>}
        </div>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* ---------- Page header ---------- */

// `back` is { label, to } for a link or { label, onClick } for a button.
export function PageHeader({ title, description, back, actions, leading }) {
  const backClass = `mb-2 inline-flex items-center gap-1.5 rounded text-sm text-ink-secondary transition-colors hover:text-primary ${focusRing}`;
  const backContent = back && (
    <>
      <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
      {back.label}
    </>
  );

  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-line pb-5">
      <div className="flex min-w-0 items-start gap-3">
        {leading}
        <div className="min-w-0">
          {back &&
            (back.to ? (
              <Link to={back.to} className={backClass}>
                {backContent}
              </Link>
            ) : (
              <button type="button" onClick={back.onClick} className={backClass}>
                {backContent}
              </button>
            ))}
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-secondary">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ---------- Forms ---------- */

const CONTROL_BASE =
  "block w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition-colors hover:border-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-page disabled:text-ink-secondary disabled:hover:border-line";

export const inputClass = `${CONTROL_BASE} h-10`;

export function Input({ className = "", ...props }) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", rows = 4, ...props }) {
  return <textarea rows={rows} className={`${CONTROL_BASE} py-2 leading-6 ${className}`} {...props} />;
}

export function FileInput({ className = "", ...props }) {
  return (
    <input
      type="file"
      className={`block w-full cursor-pointer rounded-lg border border-line bg-surface text-sm text-ink-secondary transition-colors file:mr-3 file:h-10 file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-line file:bg-page file:px-4 file:text-sm file:font-medium file:text-ink hover:border-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 ${className}`}
      {...props}
    />
  );
}

// An input with a leading icon, used for search boxes and the sign-in fields.
export function IconInput({ icon: Icon, className = "", ...props }) {
  return (
    <span className="relative block">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <Input className={`pl-9 ${className}`} {...props} />
    </span>
  );
}

export function SearchInput({ label, ...props }) {
  return <IconInput icon={MagnifyingGlassIcon} type="search" aria-label={label} {...props} />;
}

// Wraps a control in its label, so the two are associated without ids.
export function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-secondary">{hint}</span>}
    </label>
  );
}

export function FormActions({ className = "", children }) {
  return (
    <div className={`flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Feedback ---------- */

const ALERT_TONES = {
  success: { box: "border-success/30 bg-success/10", icon: "text-success", Icon: CheckCircleIcon },
  error: { box: "border-danger/30 bg-danger/10", icon: "text-danger", Icon: XCircleIcon },
  warning: { box: "border-warning/40 bg-warning/10", icon: "text-warning", Icon: ExclamationTriangleIcon },
  info: { box: "border-info/30 bg-info/10", icon: "text-info", Icon: InformationCircleIcon },
};

export function Alert({ tone = "info", className = "", children }) {
  const { box, icon, Icon } = ALERT_TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm text-ink ${box} ${className}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const BADGE_TONES = {
  neutral: { box: "bg-page", dot: "bg-ink-muted" },
  primary: { box: "bg-primary/10", dot: "bg-primary" },
  success: { box: "bg-success/10", dot: "bg-success" },
  warning: { box: "bg-warning/10", dot: "bg-warning" },
  danger: { box: "bg-danger/10", dot: "bg-danger" },
  info: { box: "bg-info/10", dot: "bg-info" },
};

// The tone is carried by the tint and the dot; the label stays in body ink so it is readable.
export function Badge({ tone = "neutral", className = "", children }) {
  const { box, dot } = BADGE_TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium text-ink ${box} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div role="status" className={`${cardClass} flex items-center justify-center gap-3 px-6 py-16 text-sm text-ink-secondary`}>
      <Spinner className="h-5 w-5 text-primary" />
      {label}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div role="alert" className={`${cardClass} px-6 py-14 text-center`}>
      <ExclamationTriangleIcon className="mx-auto h-9 w-9 text-warning" aria-hidden="true" />
      <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
      {message && <p className="mx-auto mt-1 max-w-md text-sm text-ink-secondary">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, to, cta }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      {Icon && <Icon className="h-8 w-8 text-ink-muted" aria-hidden="true" />}
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-sm text-ink-secondary">{hint}</p>}
      {to && (
        <TextLink to={to} className="mt-3 text-sm">
          {cta}
        </TextLink>
      )}
    </div>
  );
}

/* ---------- Tables ---------- */

// Scrolls sideways inside its own frame on narrow screens, so the page itself never does.
export function Table({ caption, className = "", children }) {
  return (
    <div className={`${cardClass} overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function Th({ className = "", children, ...props }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-line bg-page px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-secondary ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function Tr({ className = "", children, ...props }) {
  return (
    <tr className={`border-b border-line transition-colors last:border-0 hover:bg-page/70 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function Td({ className = "", children, ...props }) {
  return (
    <td className={`px-4 py-3 align-middle text-ink ${className}`} {...props}>
      {children}
    </td>
  );
}

export function Pagination({ page, pageCount, onChange, label = "Pagination" }) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-1.5">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={page === number ? "page" : undefined}
          aria-label={`Page ${number}`}
          className={`h-9 min-w-[2.25rem] rounded-lg px-2 text-sm font-medium transition-colors ${focusRing} ${
            page === number ? "bg-primary text-white" : "border border-line bg-surface text-ink hover:bg-page"
          }`}
        >
          {number}
        </button>
      ))}
    </nav>
  );
}

/* ---------- Public pages ---------- */

export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

// The title band at the top of each public page.
export function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-10 lg:py-14">
        {eyebrow && (
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/75">
            <span className="h-0.5 w-6 bg-gold" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">{description}</p>}
        {children}
      </Container>
    </section>
  );
}

export function Section({ id, title, description, className = "", children }) {
  return (
    <section id={id} className={`scroll-mt-6 ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-base leading-7 text-ink-secondary">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

// `columns` lays the items out in two columns on wider screens.
export function CheckList({ items, columns = false, className = "" }) {
  const layout = columns ? "grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2" : "space-y-2.5";
  return (
    <ul className={`text-sm leading-6 text-ink ${layout} ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
