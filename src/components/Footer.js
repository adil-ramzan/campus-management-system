import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";

const UNIVERSITY_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Administration", to: "/administration" },
  { label: "Contact", to: "/contact" },
];

const ACADEMIC_LINKS = [
  { label: "Academic Programs", to: "/academics#programs" },
  { label: "Faculties", to: "/academics#faculties" },
  { label: "Admissions", to: "/admissions" },
  { label: "International Students", to: "/admissions#international-students" },
];

const linkClass =
  "rounded text-sm text-footer-secondary transition-colors hover:text-footer-text focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-footer";

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-footer-text">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  // Signed-in pages get a single slim line, so the footer stays out of the way of the work.
  if (/^\/(admin|staff|student)(\/|$)/.test(pathname)) {
    return (
      <footer className="bg-footer">
        <div className="flex flex-col gap-1 px-4 py-4 text-xs text-footer-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Gomal University. All rights reserved.</p>
          <p>Campus Management System</p>
        </div>
      </footer>
    );
  }

  const portalLinks = user
    ? [{ label: "Dashboard", to: `/${user.role}` }]
    : [
        { label: "Log in", to: "/login" },
        { label: "Sign up", to: "/signup" },
      ];

  return (
    <footer className="border-t-2 border-gold bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className={`inline-flex items-center gap-3 ${linkClass}`}>
              <img src="/logo.png" alt="" className="h-10 w-7 shrink-0 object-cover object-left" />
              <span className="leading-tight">
                <span className="block text-base font-semibold tracking-tight text-footer-text">Gomal University</span>
                <span className="block text-xs text-footer-secondary">Campus Management System</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-footer-secondary">
              Gomal University, located in Khyber Pakhtunkhwa, has 3 campuses, 7 faculties, 10 constituent colleges,
              20 departments, centers and institutes, and more than 50 affiliated colleges.
            </p>
          </div>

          <div className="lg:col-span-2">
            <FooterColumn title="University" links={UNIVERSITY_LINKS} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Academics" links={ACADEMIC_LINKS} />
          </div>

          <div className="col-span-2 lg:col-span-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-1 lg:gap-8">
              <FooterColumn title="Portal" links={portalLinks} />
              <div>
                <h2 className="text-sm font-semibold text-footer-text">Contact</h2>
                <ul className="mt-4 space-y-3 text-sm text-footer-secondary">
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-footer-secondary" aria-hidden="true" />
                    Gomal University, KPK, Pakistan
                  </li>
                  <li className="flex items-start gap-3">
                    <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-footer-secondary" aria-hidden="true" />
                    <a href="mailto:info@gu.edu.pk" className={`break-all ${linkClass}`}>
                      info@gu.edu.pk
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-footer-secondary" aria-hidden="true" />
                    <a href="tel:+92-966-750-424-29" className={linkClass}>
                      +92 (966) 750-424-29
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-footer-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gomal University. All rights reserved.</p>
          <p>Campus Management System</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
