import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { buttonClass, focusRing } from "./ui";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics", children: ["Programs", "Faculties"] },
  { label: "Administration", to: "/administration", children: ["VC Message"] },
  { label: "Admissions", to: "/admissions", children: ["Programs", "International Students"] },
  { label: "Contact", to: "/contact" },
];

const ROLE_LABELS = { admin: "Administrator", staff: "Staff", student: "Student" };


const sectionLink = (to, section) => `${to}#${section.toLowerCase().replace(/\s+/g, "-")}`;

const desktopLinkClass = ({ isActive }) =>
  `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${focusRing} ${
    isActive ? "bg-primary/10 text-primary" : "text-ink-secondary hover:bg-page hover:text-ink"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${focusRing} ${
    isActive ? "bg-primary/10 text-primary" : "text-ink hover:bg-page"
  }`;

const menuItemClass = `flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-page focus:outline-none focus-visible:bg-page`;

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [dropdown, setDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // Dashboard pages bring their own sidebar, so the header drops the public links there.
  const isDashboard = /^\/(admin|staff|student)(\/|$)/.test(pathname);
  const dashboardPath = user ? `/${user.role}` : "/login";
  const initials = (user?.name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const closeMenus = () => {
    setDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Close open menus after navigating, on Escape, and on a click outside the header.
  useEffect(() => {
    setDropdown(null);
    setIsMobileMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    const close = () => {
      setDropdown(null);
      setIsMobileMenuOpen(false);
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = () => {
    closeMenus();
    logout(navigate);
  };

  return (
    <header ref={headerRef} className="relative z-30 border-b border-line bg-surface">
      <div
        className={`flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${
          isDashboard ? "" : "mx-auto max-w-7xl"
        }`}
      >
        <Link to="/" className={`flex min-w-0 items-center gap-3 rounded-lg ${focusRing}`}>
          {/* Only the crest of the logo file is shown; the name is set as real text beside it. */}
          <img src="/logo.png" alt="" className="h-10 w-7 shrink-0 object-cover object-left" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-semibold tracking-tight text-ink">
              Gomal University
            </span>
            <span className="hidden truncate text-xs text-ink-secondary sm:block">Campus Management System</span>
          </span>
        </Link>

        {!isDashboard && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map(({ label, to, children }) =>
              children ? (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => setDropdown(label)}
                  onMouseLeave={() => setDropdown(null)}
                  onFocus={() => setDropdown(label)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null);
                  }}
                >
                  <NavLink to={to} className={desktopLinkClass} aria-haspopup="true" aria-expanded={dropdown === label}>
                    {label}
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </NavLink>
                  {dropdown === label && (
                    <div className="absolute left-0 top-full z-50 w-56 pt-2">
                      <div className="rounded-xl border border-line bg-surface py-2 shadow-lg">
                        {children.map((section) => (
                          <Link key={section} to={sectionLink(to, section)} onClick={closeMenus} className={menuItemClass}>
                            {section}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={label} to={to} end={to === "/"} className={desktopLinkClass}>
                  {label}
                </NavLink>
              )
            )}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setDropdown(dropdown === "user" ? null : "user");
                }}
                className={`flex items-center gap-2 rounded-full p-1 hover:bg-page sm:rounded-lg sm:pr-2 ${focusRing}`}
                aria-haspopup="menu"
                aria-expanded={dropdown === "user"}
                aria-label="Account menu"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {initials || "?"}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block max-w-[9rem] truncate text-sm font-medium text-ink">{user.name}</span>
                  <span className="block text-xs text-ink-secondary">{ROLE_LABELS[user.role] || user.role}</span>
                </span>
                <ChevronDownIcon className="hidden h-4 w-4 text-ink-muted sm:block" aria-hidden="true" />
              </button>

              {dropdown === "user" && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-line bg-surface py-2 shadow-lg"
                  role="menu"
                >
                  <div className="border-b border-line px-4 pb-3 pt-1">
                    <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                    {user.email && <p className="truncate text-xs text-ink-secondary">{user.email}</p>}
                  </div>
                  <div className="py-1">
                    <Link to={dashboardPath} onClick={closeMenus} className={menuItemClass} role="menuitem">
                      <Squares2X2Icon className="h-5 w-5 text-ink-muted" aria-hidden="true" />
                      Dashboard
                    </Link>
                    {isDashboard && (
                      <Link to="/" onClick={closeMenus} className={menuItemClass} role="menuitem">
                        <GlobeAltIcon className="h-5 w-5 text-ink-muted" aria-hidden="true" />
                        University website
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-line pt-1">
                    <button onClick={handleLogout} className={`${menuItemClass} text-danger`} role="menuitem">
                      <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-ink transition-colors hover:bg-page ${focusRing}`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className={buttonClass("primary", "md", "hidden sm:inline-flex")}
              >
                Sign up
              </Link>
            </>
          )}

          {!isDashboard && (
            <button
              onClick={() => {
                setDropdown(null);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`rounded-lg p-2 text-ink hover:bg-page lg:hidden ${focusRing}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && !isDashboard && (
        <nav
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-surface px-4 py-3 shadow-lg lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {NAV_LINKS.map(({ label, to, children }) => (
              <li key={label}>
                <NavLink to={to} end={to === "/"} onClick={closeMenus} className={mobileLinkClass}>
                  {label}
                </NavLink>
                {children && (
                  <ul className="ml-3 border-l border-line pl-3">
                    {children.map((section) => (
                      <li key={section}>
                        <Link
                          to={sectionLink(to, section)}
                          onClick={closeMenus}
                          className={`block rounded-lg px-3 py-2 text-sm text-ink-secondary hover:bg-page ${focusRing}`}
                        >
                          {section}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-line pt-3">
            {user ? (
              <div className="space-y-1">
                <Link to={dashboardPath} onClick={closeMenus} className={mobileLinkClass({ isActive: false })}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-danger hover:bg-danger/10 ${focusRing}`}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className={buttonClass("secondary")}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenus}
                  className={buttonClass("primary")}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default NavBar;
