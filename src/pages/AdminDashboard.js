import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  DocumentArrowUpIcon,
  MegaphoneIcon,
  PlusCircleIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip } from "chart.js";
import { API_URL } from "../config";
import { CHART_SERIES, COLORS } from "../theme";
import { getAdminDashboardDemo } from "../data/adminDashboardDemo";
import { PortalPage } from "../components/PortalLayout";
import { Button } from "../components/ui";
import {
  DashboardError,
  DashboardNotice,
  DashboardSkeleton,
  EmptyState,
  Meter,
  Panel,
  PanelLink,
  QuickActions,
  StatCard,
  asArray,
  formatDate,
  formatNumber,
  percent,
  timeAgo,
  toTime,
} from "../components/DashboardUI";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

// Same stack as the page body in index.css, so chart labels match the surrounding text.
const CHART_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
const CHART_INK = COLORS.inkSecondary;
const CHART_GRID = COLORS.line;
const BAR_COLOR = COLORS.primary;
// Fixed categorical order; programs beyond these fold into "Other".
const PROGRAM_COLORS = CHART_SERIES;
const NEUTRAL_COLOR = COLORS.inkMuted;

const ENDPOINTS = {
  stats: "/api/admin/dashboard",
  courses: "/api/admin/courses",
  assignments: "/api/admin/assignments",
  students: "/api/admin/students",
  announcements: "/api/admin/announcements",
};

const QUICK_ACTIONS = [
  { label: "Add Student", to: "/admin/create-user?role=student", icon: UserPlusIcon },
  { label: "Add Staff", to: "/admin/create-user?role=staff", icon: UsersIcon },
  { label: "Create Course", to: "/admin/create-course", icon: PlusCircleIcon },
  { label: "Enroll Student", to: "/admin/enroll-student", icon: ClipboardDocumentCheckIcon },
  { label: "Announcements", to: "/admin/announcements", icon: MegaphoneIcon },
];

const ACTIVITY_ICONS = {
  submission: DocumentArrowUpIcon,
  announcement: MegaphoneIcon,
  student: UserPlusIcon,
  course: BookOpenIcon,
};

// "23-27" -> "2023–27"
const formatSession = (session) => {
  const match = /^(\d{2})-(\d{2})$/.exec(session);
  return match ? `20${match[1]}–${match[2]}` : session;
};

// Loads everything the dashboard shows. Falls back to demo data only when the API
// cannot be reached at all; an API that answers with an error is reported as an error.
async function fetchDashboard() {
  const keys = Object.keys(ENDPOINTS);
  const results = await Promise.allSettled(
    keys.map((key) => axios.get(`${API_URL}${ENDPOINTS[key]}`, { withCredentials: true }))
  );

  if (results.every((result) => result.status === "rejected" && !result.reason?.response)) {
    return { data: getAdminDashboardDemo(), isDemo: true, isPartial: false };
  }
  if (results[0].status === "rejected") throw results[0].reason;

  const [stats, courses, assignments, students, announcements] = results.map((result) =>
    result.status === "fulfilled" ? result.value.data : null
  );
  return {
    data: {
      stats: stats || {},
      courses: asArray(courses),
      assignments: asArray(assignments),
      students: asArray(students),
      announcements: asArray(announcements),
    },
    isDemo: false,
    isPartial: results.some((result) => result.status === "rejected"),
  };
}

// Turns the raw API data into the figures each dashboard section displays.
function buildView({ stats, courses, assignments, students, announcements }) {
  const studentNames = new Map(students.map((student) => [student._id, student.name]));
  const now = Date.now();

  const enrollment = courses
    .map((course) => ({ title: course.title || "Untitled course", count: asArray(course.studentsEnrolled).length }))
    .sort((a, b) => b.count - a.count);
  const totalEnrollments = enrollment.reduce((sum, course) => sum + course.count, 0);

  const programCounts = new Map();
  for (const student of students) {
    const program = student.course || "Unassigned";
    programCounts.set(program, (programCounts.get(program) || 0) + 1);
  }
  const named = [...programCounts.entries()].filter(([name]) => name !== "Unassigned").sort((a, b) => b[1] - a[1]);
  const kept = named.slice(0, PROGRAM_COLORS.length).sort((a, b) => a[0].localeCompare(b[0]));
  const programs = kept.map(([name, count], index) => ({ name, count, color: PROGRAM_COLORS[index] }));
  const otherCount = named.slice(PROGRAM_COLORS.length).reduce((sum, [, count]) => sum + count, 0);
  if (otherCount) programs.push({ name: "Other", count: otherCount, color: NEUTRAL_COLOR });
  if (programCounts.has("Unassigned")) {
    programs.push({ name: "Unassigned", count: programCounts.get("Unassigned"), color: COLORS.line });
  }

  const sessions = [...new Set(students.map((student) => student.session).filter(Boolean))].sort();

  const attendanceByCourse = courses
    .map((course) => {
      const records = asArray(course.studentsEnrolled).flatMap((entry) => asArray(entry.attendance));
      return {
        title: course.title || "Untitled course",
        total: records.length,
        present: records.filter((record) => record.status === "present").length,
      };
    })
    .filter((course) => course.total > 0)
    .sort((a, b) => b.total - a.total);
  const attendanceTotal = attendanceByCourse.reduce((sum, course) => sum + course.total, 0);
  const attendancePresent = attendanceByCourse.reduce((sum, course) => sum + course.present, 0);

  const submissions = assignments.flatMap((assignment) =>
    asArray(assignment.submissions).map((submission) => ({ ...submission, assignmentTitle: assignment.title }))
  );
  const gradedCount = submissions.filter((submission) => submission.grade).length;

  // The API has no activity feed, so recent activity is derived from record timestamps.
  const events = (type, items, describe, dateOf) =>
    items
      .map((item) => ({ type, id: `${type}-${item._id}`, time: toTime(dateOf(item)), ...describe(item) }))
      .filter((event) => event.time && event.time <= now)
      .sort((a, b) => b.time - a.time)
      .slice(0, 3);
  const activity = [
    ...events(
      "submission",
      submissions,
      (submission) => ({
        title: `${submission.student?.name || studentNames.get(submission.student) || "A student"} submitted an assignment`,
        detail: submission.assignmentTitle,
      }),
      (submission) => submission.submittedAt
    ),
    ...events(
      "announcement",
      announcements,
      (announcement) => ({ title: "Announcement posted", detail: announcement.title }),
      (announcement) => announcement.createdAt
    ),
    ...events(
      "student",
      students,
      (student) => ({ title: "New student registered", detail: student.name }),
      (student) => student.createdAt
    ),
    ...events(
      "course",
      courses,
      (course) => ({ title: "Course added", detail: course.title }),
      (course) => course.createdAt
    ),
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);

  const datedAnnouncements = announcements.every((announcement) => toTime(announcement.createdAt));
  const latestAnnouncements = (
    datedAnnouncements
      ? [...announcements].sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
      : announcements
  ).slice(0, 4);

  return {
    totals: {
      students: stats.totalStudents ?? students.length,
      staff: stats.totalStaff ?? 0,
      courses: stats.totalCourses ?? courses.length,
    },
    enrollment,
    totalEnrollments,
    programs,
    programTotal: programs.reduce((sum, program) => sum + program.count, 0),
    sessions,
    attendance: { total: attendanceTotal, present: attendancePresent, courses: attendanceByCourse.slice(0, 4) },
    grading: { total: submissions.length, graded: gradedCount },
    activity,
    latestAnnouncements,
  };
}

function EnrollmentChart({ courses }) {
  const top = courses.slice(0, 8);
  const data = {
    labels: top.map((course) => course.title),
    datasets: [
      {
        label: "Students enrolled",
        data: top.map((course) => course.count),
        backgroundColor: BAR_COLOR,
        borderRadius: 4,
        maxBarThickness: 16,
      },
    ],
  };
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: CHART_GRID },
        ticks: { precision: 0, color: CHART_INK, font: { family: CHART_FONT } },
      },
      y: {
        border: { color: CHART_GRID },
        grid: { display: false },
        ticks: {
          color: COLORS.ink,
          font: { family: CHART_FONT },
          callback(value) {
            const label = this.getLabelForValue(value);
            // Narrow charts get shorter labels so the bars keep most of the width.
            const limit = this.chart.width < 420 ? 16 : 28;
            return label.length > limit ? `${label.slice(0, limit - 1)}…` : label;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="relative w-full min-w-0" style={{ height: Math.max(180, top.length * 38 + 36) }}>
        <Bar data={data} options={options} role="img" aria-label="Students enrolled per course" />
      </div>
      <table className="sr-only">
        <caption>Students enrolled per course</caption>
        <tbody>
          {top.map((course) => (
            <tr key={course.title}>
              <th scope="row">{course.title}</th>
              <td>{course.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ProgramChart({ programs, total }) {
  const data = {
    labels: programs.map((program) => program.name),
    datasets: [
      {
        data: programs.map((program) => program.count),
        backgroundColor: programs.map((program) => program.color),
        borderColor: COLORS.surface,
        borderWidth: 2,
        hoverOffset: 2,
      },
    ],
  };
  const options = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 sm:flex-row sm:items-center xl:flex-col xl:items-stretch">
      <div className="relative mx-auto h-44 w-44 shrink-0">
        <Doughnut data={data} options={options} role="img" aria-label="Students by program" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-ink">{formatNumber(total)}</span>
          <span className="text-xs text-ink-secondary">students</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2.5">
        {programs.map((program) => (
          <li key={program.name} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: program.color }} />
            <span className="min-w-0 flex-1 truncate text-ink">{program.name}</span>
            <span className="font-medium text-ink">{formatNumber(program.count)}</span>
            <span className="w-10 text-right text-ink-secondary">{percent(program.count, total)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminDashboard() {
  const [state, setState] = useState({ status: "loading", data: null, isDemo: false, isPartial: false });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      setState({ status: "ready", ...(await fetchDashboard()) });
    } catch (err) {
      setState({ status: "error", data: null, isDemo: false, isPartial: false });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const view = useMemo(() => (state.data ? buildView(state.data) : null), [state.data]);
  const isLoading = state.status === "loading";
  const announcementCount = view ? view.latestAnnouncements.length : 0;
  return (
    <PortalPage
      title="Admin Dashboard"
      description="Overview of campus activity and academic operations."
      width="wide"
      actions={
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={load}
            disabled={isLoading}
            aria-label="Refresh dashboard"
            title="Refresh"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            to="/admin/announcements"
            className="relative"
            aria-label={announcementCount ? `Announcements (${announcementCount})` : "Announcements"}
            title="Announcements"
          >
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            {announcementCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold ring-2 ring-surface" />
            )}
          </Button>
        </>
      }
    >
          {state.status === "ready" && state.isDemo && (
            <DashboardNotice>
              <span className="font-semibold">Demo data.</span> The server could not be reached, so sample figures are
              shown.
            </DashboardNotice>
          )}
          {state.status === "ready" && state.isPartial && (
            <DashboardNotice>Some sections could not be loaded and may be incomplete. Try refreshing.</DashboardNotice>
          )}

          {isLoading && <DashboardSkeleton />}

          {state.status === "error" && <DashboardError onRetry={load} />}

          {state.status === "ready" && view && (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  icon={AcademicCapIcon}
                  label="Students"
                  value={formatNumber(view.totals.students)}
                  caption={
                    view.programs.length
                      ? `Across ${view.programs.length} program${view.programs.length === 1 ? "" : "s"}`
                      : "No students yet"
                  }
                />
                <StatCard icon={UserGroupIcon} label="Staff" value={formatNumber(view.totals.staff)} caption="Instructors and staff" />
                <StatCard
                  icon={BookOpenIcon}
                  label="Courses"
                  value={formatNumber(view.totals.courses)}
                  caption={`${formatNumber(view.totalEnrollments)} enrollment${view.totalEnrollments === 1 ? "" : "s"}`}
                />
                <StatCard
                  icon={CalendarDaysIcon}
                  label="Active Sessions"
                  value={formatNumber(view.sessions.length)}
                  caption={
                    view.sessions.length > 2
                      ? `${formatSession(view.sessions[0])} to ${formatSession(view.sessions[view.sessions.length - 1])}`
                      : view.sessions.map(formatSession).join(" and ") || "No academic sessions yet"
                  }
                />
              </div>

              <Panel title="Quick actions">
                <QuickActions actions={QUICK_ACTIONS} columns="sm:grid-cols-3 xl:grid-cols-5" />
              </Panel>

              <div className="grid gap-6 xl:grid-cols-3">
                <Panel
                  title="Enrollment overview"
                  subtitle={
                    view.enrollment.length > 8
                      ? `Students enrolled per course, top 8 of ${view.enrollment.length}`
                      : "Students enrolled per course"
                  }
                  action={<PanelLink to="/admin/manage-courses">Manage courses</PanelLink>}
                  className="xl:col-span-2"
                >
                  {view.totalEnrollments > 0 ? (
                    <EnrollmentChart courses={view.enrollment} />
                  ) : view.enrollment.length > 0 ? (
                    <EmptyState
                      icon={ClipboardDocumentCheckIcon}
                      title="No enrollments yet"
                      hint="Enroll students in a course to see how enrollment is distributed."
                      to="/admin/enroll-student"
                      cta="Enroll a student"
                    />
                  ) : (
                    <EmptyState
                      icon={BookOpenIcon}
                      title="No courses yet"
                      hint="Create your first course to start tracking enrollment."
                      to="/admin/create-course"
                      cta="Create a course"
                    />
                  )}
                </Panel>

                <Panel title="Students by program" subtitle="Share of registered students">
                  {view.programTotal > 0 ? (
                    <ProgramChart programs={view.programs} total={view.programTotal} />
                  ) : (
                    <EmptyState
                      icon={AcademicCapIcon}
                      title="No students yet"
                      hint="Program distribution appears once students are registered."
                      to="/admin/create-user"
                      cta="Add a student"
                    />
                  )}
                </Panel>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Panel title="Recent activity">
                  {view.activity.length > 0 ? (
                    <ul className="space-y-4">
                      {view.activity.map((event) => {
                        const Icon = ACTIVITY_ICONS[event.type];
                        return (
                          <li key={event.id} className="flex gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-page text-ink-secondary">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-ink">{event.title}</p>
                              <p className="truncate text-sm text-ink-secondary">{event.detail}</p>
                            </div>
                            <time className="shrink-0 text-xs text-ink-secondary" dateTime={new Date(event.time).toISOString()}>
                              {timeAgo(event.time)}
                            </time>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <EmptyState
                      icon={CalendarDaysIcon}
                      title="No recent activity"
                      hint="New registrations, submissions and announcements will appear here."
                    />
                  )}
                </Panel>

                <Panel title="Latest announcements" action={<PanelLink to="/admin/announcements">Manage</PanelLink>}>
                  {view.latestAnnouncements.length > 0 ? (
                    <ul className="-my-3 divide-y divide-line">
                      {view.latestAnnouncements.map((announcement) => (
                        <li key={announcement._id} className="py-3">
                          <p className="text-sm font-medium text-ink">{announcement.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-ink-secondary">{announcement.content}</p>
                          {toTime(announcement.dueDate) && (
                            <p className="mt-1 text-xs text-ink-secondary">Expires {formatDate(announcement.dueDate)}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      icon={MegaphoneIcon}
                      title="No announcements yet"
                      hint="Announcements you post are shown to students."
                      to="/admin/announcements"
                      cta="Create an announcement"
                    />
                  )}
                </Panel>

                <Panel title="Attendance overview" className="md:col-span-2 xl:col-span-1">
                  {view.attendance.total > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-semibold tracking-tight text-ink">
                          {percent(view.attendance.present, view.attendance.total)}%
                        </p>
                        <p className="mt-0.5 text-sm text-ink-secondary">
                          Present across {formatNumber(view.attendance.total)} recorded classes
                        </p>
                      </div>
                      {view.attendance.courses.map((course) => (
                        <Meter key={course.title} label={course.title} value={percent(course.present, course.total)} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={ClipboardDocumentCheckIcon}
                      title="No attendance recorded"
                      hint="Attendance rates appear once instructors mark attendance."
                    />
                  )}
                  {view.grading.total > 0 && (
                    <div className="mt-5 border-t border-line pt-4">
                      <Meter
                        label="Assignments graded"
                        value={percent(view.grading.graded, view.grading.total)}
                        detail={`${formatNumber(view.grading.graded)} of ${formatNumber(view.grading.total)}`}
                      />
                    </div>
                  )}
                </Panel>
              </div>
            </>
          )}
    </PortalPage>
  );
}

export default AdminDashboard;
