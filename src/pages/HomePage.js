import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  Squares2X2Icon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";
import {
  Alert,
  Button,
  Card,
  CheckList,
  Container,
  Field,
  IconInput,
  Section,
  TextLink,
  cardClass,
  focusRing,
} from "../components/ui";

const FEATURES = [
  { icon: Squares2X2Icon, text: "Role-based Dashboards for Admin, Staff & Students" },
  { icon: ClipboardDocumentCheckIcon, text: "Real-time Course & Attendance Management" },
  { icon: ClipboardDocumentListIcon, text: "Assignment Submissions & Grading" },
];

const FACTS = [
  ["1974", "Founded"],
  ["3", "Campuses"],
  ["7", "Faculties"],
  ["25,000+", "Students enrolled"],
];

const EXPLORE = [
  { icon: AcademicCapIcon, title: "Academics", text: "Bachelor programs and the faculties that teach them.", to: "/academics" },
  { icon: UserPlusIcon, title: "Admissions", text: "Programs on offer and guidance for international students.", to: "/admissions" },
  { icon: BuildingLibraryIcon, title: "Administration", text: "A message from the Vice Chancellor.", to: "/administration" },
  { icon: PhoneIcon, title: "Contact", text: "Reach the university by phone, email or message.", to: "/contact" },
];

const ROLES = [
  {
    title: "Administrators",
    points: ["Create courses and user accounts", "Enroll students in courses", "Publish announcements"],
  },
  {
    title: "Staff",
    points: ["Mark and review attendance", "Create assignments", "Grade student submissions"],
  },
  {
    title: "Students",
    points: ["Follow enrolled courses", "Submit assignments", "Track attendance and progress"],
  },
];

function HomePage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters long.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "staff") navigate("/staff");
      else if (result.role === "student") navigate("/student");
      else navigate("/");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy">
        <img src="/gu2.jpeg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-navy/85" />

        <Container className="grid items-center gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="text-white lg:col-span-7">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/75">
              <span className="h-0.5 w-6 bg-gold" aria-hidden="true" />
              Gomal University
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Campus Management System</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
              A centralized platform built to manage student records, faculty assignments, course enrollments, and
              academic announcements with ease. Designed for universities and colleges to streamline academic
              operations.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/90">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <Card padded={false} className="p-5 sm:p-8 lg:col-span-5">
            {user ? (
              <>
                <h2 className="text-xl font-semibold text-ink">Welcome back</h2>
                <p className="mt-1.5 text-sm text-ink-secondary">
                  You are signed in as <span className="font-medium text-ink">{user.name}</span>.
                </p>
                <Button to={`/${user.role}`} className="mt-6 w-full">
                  Go to your dashboard
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-ink">Login</h2>
                <p className="mt-1.5 text-sm text-ink-secondary">Sign in to open your dashboard.</p>
                <form onSubmit={handleLogin} className="mt-6 space-y-5">
                  {error && <Alert tone="error">{error}</Alert>}

                  <Field label="Email">
                    <IconInput
                      icon={EnvelopeIcon}
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field label="Password">
                    <IconInput
                      icon={LockClosedIcon}
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        if (e.target.value.length <= 15) {
                          setPassword(e.target.value);
                        }
                      }}
                      required
                    />
                  </Field>

                  <Button type="submit" className="w-full" loading={loading} loadingLabel="Signing in...">
                    Login
                  </Button>
                </form>
                <p className="mt-5 text-center text-sm text-ink-secondary">
                  New student? <TextLink to="/signup">Create an account</TextLink>
                </p>
              </>
            )}
          </Card>
        </Container>
      </section>

      <section className="border-b border-line bg-surface" aria-label="Key facts">
        <Container>
          <dl className="grid grid-cols-2 gap-y-6 py-8 lg:grid-cols-4">
            {FACTS.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse px-2 text-center">
                <dt className="mt-1 text-sm text-ink-secondary">{label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="space-y-12 py-10 lg:py-14">
        <Section title="Explore the university" description="Programs, admissions, leadership and how to reach us.">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE.map(({ icon: Icon, title, text, to }) => (
              <li key={title}>
                <Link
                  to={to}
                  className={`group flex h-full flex-col ${cardClass} p-5 transition-colors hover:border-primary/40 ${focusRing}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink group-hover:text-primary">{title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-6 text-ink-secondary">{text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="One portal for the whole campus" description="Each role signs in to a dashboard built for its work.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ROLES.map(({ title, points }) => (
              <Card key={title} as="article">
                <h3 className="border-l-2 border-gold pl-3 text-base font-semibold text-ink">{title}</h3>
                <CheckList items={points} className="mt-4" />
              </Card>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
}

export default HomePage;
