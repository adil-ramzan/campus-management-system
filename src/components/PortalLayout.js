// The frame shared by every signed-in page: the deep blue sidebar for the current role
// beside the page content. On small screens the sidebar becomes a slide-in drawer.
import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AcademicCapIcon,
  Bars3Icon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentPlusIcon,
  InboxIcon,
  MegaphoneIcon,
  PlusCircleIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "./ui";

// `match` marks the detail pages that belong under a link, so it stays highlighted there.
const PORTALS = {
  admin: {
    label: "Admin Panel",
    links: [
      { label: "Dashboard", to: "/admin", icon: Squares2X2Icon },
      { label: "Manage Courses", to: "/admin/manage-courses", icon: RectangleStackIcon, match: /^\/admin\/update-course\// },
      { label: "Create Course", to: "/admin/create-course", icon: PlusCircleIcon },
      { label: "Enroll Student", to: "/admin/enroll-student", icon: ClipboardDocumentCheckIcon },
      { label: "Students", to: "/admin/students", icon: AcademicCapIcon, match: /^\/admin\/edit-student\// },
      { label: "Instructors", to: "/admin/instructors", icon: UserGroupIcon, match: /^\/admin\/edit-staff\// },
      { label: "Announcements", to: "/admin/announcements", icon: MegaphoneIcon },
      { label: "Create User", to: "/admin/create-user", icon: UserPlusIcon },
    ],
  },
  staff: {
    label: "Staff Portal",
    links: [
      { label: "Dashboard", to: "/staff", icon: Squares2X2Icon },
      { label: "My Courses", to: "/staff#assigned-courses", icon: BookOpenIcon, match: /^\/staff\/courses?\// },
      { label: "Create Assignment", to: "/staff/assignments", icon: DocumentPlusIcon },
      {
        label: "Submissions",
        to: "/staff/submitted-assignments",
        icon: InboxIcon,
        match: /^\/staff\/assignments\/[^/]+\/(grade|submissions)/,
      },
    ],
  },
  student: {
    label: "Student Portal",
    links: [
      { label: "Dashboard", to: "/student", icon: Squares2X2Icon },
      { label: "My Courses", to: "/student#enrolled-courses", icon: BookOpenIcon, match: /^\/student\/courses\// },
      {
        label: "Assignments",
        to: "/student#upcoming-assignments",
        icon: ClipboardDocumentListIcon,
        match: /^\/student\/assignments\//,
      },
      { label: "Announcements", to: "/student#announcements", icon: MegaphoneIcon },
    ],
  },
};

const findActive = (links, pathname, hash) =>
  links.find((link) => link.to === pathname + hash) ||
  links.find((link) => link.match?.test(pathname)) ||
  links.find((link) => link.to === pathname);

const PortalMenuContext = createContext(null);

// The button that opens the sidebar drawer. It is only visible below the desktop breakpoint.
function PortalMenuButton() {
  const openMenu = useContext(PortalMenuContext);
  if (!openMenu) return null;
  return (
    <button
      type="button"
      onClick={openMenu}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink-secondary transition-colors hover:bg-page hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
      aria-label="Open menu"
    >
      <Bars3Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

export function PortalLayout({ children }) {
  const { pathname, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const portal = PORTALS[pathname.split("/")[1]];

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!portal) return children;
  const active = findActive(portal.links, pathname, hash);

  return (
    <div className="flex min-h-screen bg-page">
      {isOpen && <div className="fixed inset-0 z-40 bg-navy/40 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-navy transition-[transform,visibility] duration-200 lg:visible lg:static lg:z-auto lg:w-60 lg:shrink-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <div className="flex items-center justify-between px-5 pb-2 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{portal.label}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="space-y-1 px-3 pb-6 pt-2" aria-label={portal.label}>
            {portal.links.map((link) => {
              const { label, to, icon: Icon } = link;
              const isActive = link === active;
              return (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isActive
                      ? "bg-white/10 text-white shadow-[inset_3px_0_0_theme(colors.gold)]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <PortalMenuContext.Provider value={() => setIsOpen(true)}>
        <div className="min-w-0 flex-1">{children}</div>
      </PortalMenuContext.Provider>
    </div>
  );
}

const WIDTHS = { narrow: "max-w-2xl", default: "max-w-4xl", wide: "max-w-none" };

// A complete signed-in page: sidebar, page header, then the content at a readable width.
export function PortalPage({ title, description, back, actions, width = "default", children }) {
  return (
    <PortalLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          title={title}
          description={description}
          back={back}
          actions={actions}
          leading={<PortalMenuButton />}
        />
        <div className={`space-y-6 ${WIDTHS[width]}`}>{children}</div>
      </div>
    </PortalLayout>
  );
}
