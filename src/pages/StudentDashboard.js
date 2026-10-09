import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowPathIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentArrowUpIcon,
  MegaphoneIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { getStudentDashboardDemo } from "../data/studentDashboardDemo";
import { PortalPage } from "../components/PortalLayout";
import { Button, buttonClass as kitButtonClass } from "../components/ui";
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
  dayLabel,
  dueLabel,
  formatDate,
  formatNumber,
  percent,
  timeAgo,
  toTime,
} from "../components/DashboardUI";

const ACTIVITY_ICONS = { present: CheckCircleIcon, absent: XCircleIcon, announcement: MegaphoneIcon };
const buttonClass = kitButtonClass("secondary", "sm");

// "23-27" -> "2023–27"
const formatSession = (session) => {
  const match = /^(\d{2})-(\d{2})$/.exec(session);
  return match ? `20${match[1]}–${match[2]}` : session;
};

const isGraded = (assignment) => Boolean(assignment.grade) && assignment.grade !== "N/A";
const hasFeedback = (assignment) => Boolean(assignment.feedback) && assignment.feedback !== "No feedback";

// Loads everything the dashboard shows. Falls back to demo data only when the API
// cannot be reached at all; an API that answers with an error is reported as an error.
async function fetchStudentDashboard() {
  const get = (path) => axios.get(`${API_URL}${path}`, { withCredentials: true });

  const results = await Promise.allSettled([
    get("/api/student/dashboard"),
    get("/api/student/announcements"),
    get("/api/student/progress"),
    get("/api/assignments/student"),
  ]);
  if (results.every((result) => result.status === "rejected" && !result.reason?.response)) {
    return { data: getStudentDashboardDemo(), isDemo: true, isPartial: false };
  }
  if (results[0].status === "rejected") throw results[0].reason;

  const [dashboard, announcements, progress, assignments] = results.map((result) =>
    result.status === "fulfilled" ? result.value.data : null
  );

  const courses = asArray(dashboard?.dashboardData);
  const attendanceResults = await Promise.allSettled(
    courses.map((course) => get(`/api/student/courses/${course.courseId}/attendance`))
  );
  const attendance = {};
  courses.forEach((course, index) => {
    const result = attendanceResults[index];
    attendance[course.courseId] = result.status === "fulfilled" ? asArray(result.value.data?.attendance) : [];
  });

  return {
    data: {
      dashboard: dashboard || {},
      announcements: asArray(announcements),
      progress: progress || {},
      assignments: asArray(assignments),
      attendance,
    },
    isDemo: false,
    isPartial: [...results, ...attendanceResults].some((result) => result.status === "rejected"),
  };
}

// Turns the raw API data into the figures each dashboard section displays.
function buildView({ dashboard, announcements, progress, assignments, attendance }) {
  const now = Date.now();
  const dueTimes = new Map(assignments.map((assignment) => [assignment._id, toTime(assignment.dueDate)]));
  const allAssignments = [];
  const activity = [];

  const courses = asArray(dashboard.dashboardData).map((course) => {
    const title = course.courseTitle || "Untitled course";
    const summary = asArray(course.assignmentSummary);
    const records = attendance[course.courseId] || [];
    const present = records.filter((record) => record.status === "present").length;

    for (const assignment of summary) {
      allAssignments.push({
        id: assignment.assignmentId,
        title: assignment.title,
        courseTitle: title,
        submitted: Boolean(assignment.submitted),
        grade: isGraded(assignment) ? assignment.grade : null,
        feedback: hasFeedback(assignment) ? assignment.feedback : null,
        dueTime: dueTimes.get(assignment.assignmentId) || null,
      });
    }

    for (const record of records) {
      const time = toTime(record.date);
      if (time && time <= now) {
        activity.push({
          type: record.status === "present" ? "present" : "absent",
          id: `attendance-${record._id}`,
          time,
          title: record.status === "present" ? "Marked present" : "Marked absent",
          detail: title,
          when: dayLabel(time),
        });
      }
    }

    return {
      id: course.courseId,
      title,
      creditHours: course.creditHours,
      startTime: toTime(course.startDate),
      // Prefer the detailed records; fall back to the percentage the dashboard endpoint reports.
      attendanceRate: records.length ? percent(present, records.length) : Number(course.attendancePercentage) || 0,
      classes: records.length,
      present,
      assignments: summary.length,
      submitted: summary.filter((assignment) => assignment.submitted).length,
    };
  });

  for (const announcement of announcements) {
    const time = toTime(announcement.createdAt);
    if (time && time <= now) {
      activity.push({
        type: "announcement",
        id: `announcement-${announcement._id}`,
        time,
        title: "New announcement",
        detail: announcement.title,
        when: timeAgo(time),
      });
    }
  }

  const byNewest = (a, b) => b.time - a.time;
  const attendanceEvents = activity.filter((event) => event.type !== "announcement").sort(byNewest).slice(0, 4);
  const announcementEvents = activity.filter((event) => event.type === "announcement").sort(byNewest).slice(0, 3);

  const totalClasses = courses.reduce((sum, course) => sum + course.classes, 0);
  const totalPresent = courses.reduce((sum, course) => sum + course.present, 0);
  const attendanceRate = totalClasses
    ? percent(totalPresent, totalClasses)
    : courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.attendanceRate, 0) / courses.length)
    : null;

  const startOfToday = new Date(new Date().toDateString()).getTime();
  const submittedCount = allAssignments.filter((assignment) => assignment.submitted).length;
  const datedAnnouncements = announcements.every((announcement) => toTime(announcement.createdAt));

  return {
    details: dashboard.studentDetails || {},
    courses,
    totalCreditHours: courses.reduce((sum, course) => sum + (Number(course.creditHours) || 0), 0),
    assignmentTotal: allAssignments.length,
    submittedCount,
    gradedCount: allAssignments.filter((assignment) => assignment.grade).length,
    toSubmit: allAssignments.filter((assignment) => !assignment.submitted),
    // Everything still due, plus anything overdue that has not been handed in.
    upcoming: allAssignments
      .filter((assignment) => assignment.dueTime && (assignment.dueTime >= startOfToday || !assignment.submitted))
      .sort((a, b) => a.dueTime - b.dueTime)
      .slice(0, 5),
    grades: allAssignments.filter((assignment) => assignment.grade).slice(0, 3),
    attendanceRate,
    totalClasses,
    totalPresent,
    progress: Math.max(0, Math.min(100, Math.round(Number(progress.weeklyProgress) || 0))),
    latestAnnouncements: (datedAnnouncements
      ? [...announcements].sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
      : announcements
    ).slice(0, 4),
    recentActivity: [...attendanceEvents, ...announcementEvents].sort(byNewest).slice(0, 6),
  };
}

function StudentDashboard() {
  const [state, setState] = useState({ status: "loading", data: null, isDemo: false, isPartial: false });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      setState({ status: "ready", ...(await fetchStudentDashboard()) });
    } catch (err) {
      setState({ status: "error", data: null, isDemo: false, isPartial: false });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const view = useMemo(() => (state.data ? buildView(state.data) : null), [state.data]);
  const isLoading = state.status === "loading";

  const profile = view
    ? [
        view.details.course,
        view.details.session && `Session ${formatSession(view.details.session)}`,
        view.details.semester && `${view.details.semester} semester`,
      ].filter(Boolean)
    : [];

  // Actions go straight to the page when there is one obvious target, and otherwise
  // jump to the section of this page that lists the choices.
  const nextToSubmit = view?.toSubmit[0];
  const onlyCourse = view?.courses.length === 1 ? view.courses[0] : null;
  const quickActions = [
    {
      label: "Submit Assignment",
      to: nextToSubmit ? `/student/assignments/${nextToSubmit.id}/submit` : "/student#upcoming-assignments",
      icon: DocumentArrowUpIcon,
    },
    {
      label: "View Attendance",
      to: onlyCourse ? `/student/courses/${onlyCourse.id}/attendance` : "/student#enrolled-courses",
      icon: ClipboardDocumentCheckIcon,
    },
    { label: "My Courses", to: "/student#enrolled-courses", icon: BookOpenIcon },
    { label: "Announcements", to: "/student#announcements", icon: MegaphoneIcon },
  ];

  return (
    <PortalPage
      title="Student Dashboard"
      description={
        <>
          Your courses, assignments and attendance in one place.
          {profile.length > 0 && <span className="mt-1.5 block font-medium text-ink">{profile.join(" · ")}</span>}
        </>
      }
      width="wide"
      actions={
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
                icon={BookOpenIcon}
                label="Courses"
                value={formatNumber(view.courses.length)}
                caption={view.courses.length ? `${view.totalCreditHours} credit hours` : "Not enrolled yet"}
              />
              <StatCard
                icon={ClipboardDocumentListIcon}
                label="Assignments"
                value={formatNumber(view.assignmentTotal)}
                caption={
                  view.assignmentTotal
                    ? view.toSubmit.length
                      ? `${view.toSubmit.length} to submit`
                      : "All submitted"
                    : "None assigned yet"
                }
              />
              <StatCard
                icon={ClipboardDocumentCheckIcon}
                label="Attendance"
                value={view.attendanceRate === null ? "–" : `${view.attendanceRate}%`}
                caption={
                  view.totalClasses
                    ? `${formatNumber(view.totalClasses)} classes recorded`
                    : view.courses.length
                    ? "Average across courses"
                    : "No records yet"
                }
              />
              <StatCard
                icon={ChartBarIcon}
                label="Academic Progress"
                value={`${view.progress}%`}
                caption="Weekly progress"
              />
            </div>

            <Panel title="Quick actions">
              <QuickActions actions={quickActions} />
            </Panel>

            <div className="grid gap-6 xl:grid-cols-3">
              <Panel
                id="enrolled-courses"
                title="Enrolled courses"
                subtitle="Courses you are taking this semester"
                className="scroll-mt-6 xl:col-span-2"
              >
                {view.courses.length > 0 ? (
                  <ul className="-my-4 divide-y divide-line">
                    {view.courses.map((course) => (
                      <li key={course.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{course.title}</p>
                          <p className="mt-0.5 text-sm text-ink-secondary">
                            {[
                              course.creditHours && `${course.creditHours} credit hours`,
                              `${course.attendanceRate}% attendance`,
                              course.assignments
                                ? `${course.submitted} of ${course.assignments} assignment${course.assignments === 1 ? "" : "s"} submitted`
                                : "No assignments",
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <Link to={`/student/courses/${course.id}/attendance`} className={`shrink-0 self-start ${buttonClass}`}>
                          Attendance
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={BookOpenIcon}
                    title="No enrolled courses"
                    hint="Courses appear here once an administrator enrolls you."
                  />
                )}
              </Panel>

              <Panel id="upcoming-assignments" title="Upcoming assignments" className="scroll-mt-6">
                {view.upcoming.length > 0 ? (
                  <ul className="-my-3 divide-y divide-line">
                    {view.upcoming.map((assignment) => (
                      <li key={assignment.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                          <p className="truncate text-sm text-ink-secondary">
                            {dueLabel(assignment.dueTime)} · {formatDate(assignment.dueTime)}
                          </p>
                          <p className="truncate text-xs text-ink-secondary">{assignment.courseTitle}</p>
                        </div>
                        {assignment.submitted ? (
                          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink">
                            <CheckCircleIcon className="h-5 w-5 text-success" aria-hidden="true" />
                            Submitted
                          </span>
                        ) : (
                          <Link to={`/student/assignments/${assignment.id}/submit`} className={`shrink-0 ${buttonClass}`}>
                            Submit
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : view.toSubmit.length > 0 ? (
                  // Due dates could not be loaded, so list what is still to be handed in.
                  <ul className="-my-3 divide-y divide-line">
                    {view.toSubmit.slice(0, 5).map((assignment) => (
                      <li key={assignment.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                          <p className="truncate text-sm text-ink-secondary">{assignment.courseTitle}</p>
                        </div>
                        <Link to={`/student/assignments/${assignment.id}/submit`} className={`shrink-0 ${buttonClass}`}>
                          Submit
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={CheckCircleIcon}
                    title="Nothing due"
                    hint="Assignments with a due date ahead will be listed here."
                  />
                )}
              </Panel>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Panel title="Assignment progress">
                {view.assignmentTotal > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-ink">
                        {percent(view.submittedCount, view.assignmentTotal)}%
                      </p>
                      <p className="mt-0.5 text-sm text-ink-secondary">
                        {view.submittedCount} of {view.assignmentTotal} submitted · {view.gradedCount} graded
                      </p>
                    </div>
                    {view.courses
                      .filter((course) => course.assignments > 0)
                      .map((course) => (
                        <Meter
                          key={course.id}
                          label={course.title}
                          value={percent(course.submitted, course.assignments)}
                          detail={`${course.submitted} of ${course.assignments}`}
                        />
                      ))}
                    {view.grades.length > 0 && (
                      <ul className="space-y-3 border-t border-line pt-4">
                        {view.grades.map((assignment) => (
                          <li key={assignment.id} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                              <p className="line-clamp-2 text-sm text-ink-secondary">
                                {assignment.feedback || assignment.courseTitle}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-md bg-page px-2 py-0.5 text-sm font-semibold text-ink">
                              {assignment.grade}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={ClipboardDocumentListIcon}
                    title="No assignments yet"
                    hint="Your submissions and grades will be tracked here."
                  />
                )}
              </Panel>

              <Panel title="Attendance overview">
                {view.courses.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-ink">{view.attendanceRate}%</p>
                      <p className="mt-0.5 text-sm text-ink-secondary">
                        {view.totalClasses
                          ? `Present in ${formatNumber(view.totalPresent)} of ${formatNumber(view.totalClasses)} classes`
                          : "Average across your courses"}
                      </p>
                    </div>
                    {view.courses.map((course) => (
                      <Meter key={course.id} label={course.title} value={course.attendanceRate} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ClipboardDocumentCheckIcon}
                    title="No attendance recorded"
                    hint="Your attendance appears once you are enrolled in a course."
                  />
                )}
              </Panel>

              <Panel id="announcements" title="Recent announcements" className="scroll-mt-6 md:col-span-2 xl:col-span-1">
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
                    title="No announcements"
                    hint="Announcements from the university will appear here."
                  />
                )}
              </Panel>
            </div>

            <Panel title="Recent activity" action={<PanelLink to="/student#enrolled-courses">My courses</PanelLink>}>
              {view.recentActivity.length > 0 ? (
                <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                  {view.recentActivity.map((event) => {
                    const Icon = ACTIVITY_ICONS[event.type];
                    return (
                      <li key={event.id} className="flex min-w-0 gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-page text-ink-secondary">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink">{event.title}</p>
                          <p className="truncate text-sm text-ink-secondary">{event.detail}</p>
                        </div>
                        <time className="shrink-0 text-xs text-ink-secondary" dateTime={new Date(event.time).toISOString()}>
                          {event.when}
                        </time>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyState
                  icon={CalendarDaysIcon}
                  title="No recent activity"
                  hint="Attendance marks and new announcements will appear here."
                />
              )}
            </Panel>
          </>
        )}
    </PortalPage>
  );
}

export default StudentDashboard;
