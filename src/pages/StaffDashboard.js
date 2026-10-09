import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { getStaffDashboardDemo } from "../data/staffDashboardDemo";
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
  formatDate,
  formatNumber,
  percent,
  timeAgo,
  toTime,
} from "../components/DashboardUI";

const DAY = 24 * 60 * 60 * 1000;
const ACTIVITY_ICONS = { submission: DocumentArrowUpIcon, attendance: ClipboardDocumentCheckIcon };
const buttonClass = kitButtonClass("secondary", "sm");

const dayKey = (time) => new Date(time).toDateString();

function dayLabel(time) {
  const days = Math.round((new Date(dayKey(Date.now())).getTime() - new Date(dayKey(time)).getTime()) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dueLabel(time) {
  const days = Math.round((new Date(dayKey(time)).getTime() - new Date(dayKey(Date.now())).getTime()) / DAY);
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

// Loads the instructor's courses, then each course's details and attendance. Falls back to
// demo data only when the API cannot be reached; an API error is reported as an error.
async function fetchStaffDashboard() {
  const get = (path) => axios.get(`${API_URL}${path}`, { withCredentials: true });

  let courses;
  try {
    courses = asArray((await get("/api/staff/dashboard")).data);
  } catch (err) {
    if (!err.response) return { data: getStaffDashboardDemo(), isDemo: true, isPartial: false };
    throw err;
  }

  const results = await Promise.allSettled(
    courses.flatMap((course) => [
      get(`/api/staff/course/${course.courseId}`),
      get(`/api/staff/courses/${course.courseId}/attendance`),
    ])
  );
  const details = {};
  const attendance = {};
  courses.forEach((course, index) => {
    const [detail, records] = [results[index * 2], results[index * 2 + 1]];
    details[course.courseId] = detail.status === "fulfilled" ? detail.value.data : null;
    attendance[course.courseId] = records.status === "fulfilled" ? asArray(records.value.data) : [];
  });

  return {
    data: { courses, details, attendance },
    isDemo: false,
    isPartial: results.some((result) => result.status === "rejected"),
  };
}

// Turns the raw API data into the figures each dashboard section displays.
function buildView({ courses, details, attendance }) {
  const now = Date.now();
  const today = dayKey(now);
  const studentNames = new Map();
  const assignments = [];
  const activity = [];

  const courseRows = courses.map((course) => {
    const title = course.courseTitle || "Untitled course";
    const detail = details[course.courseId];
    const records = attendance[course.courseId] || [];

    for (const entry of asArray(detail?.studentsEnrolled)) {
      if (entry.student?._id) studentNames.set(entry.student._id, entry.student.name);
    }

    for (const assignment of asArray(detail?.assignments)) {
      const submissions = asArray(assignment.submissions);
      assignments.push({
        id: assignment._id,
        title: assignment.title,
        courseTitle: title,
        dueTime: toTime(assignment.dueDate),
        submitted: submissions.length,
        ungraded: submissions.filter((submission) => !submission.grade).length,
      });
      for (const submission of submissions) {
        const time = toTime(submission.submittedAt);
        if (time && time <= now) {
          activity.push({
            type: "submission",
            id: `submission-${submission._id}`,
            time,
            student: submission.student,
            detail: `${assignment.title} · ${title}`,
          });
        }
      }
    }

    // Attendance is stored per student; group it by day to get one entry per class.
    const marks = records.flatMap((record) => asArray(record.attendance));
    const classDays = new Map();
    for (const mark of marks) {
      const time = toTime(mark.date);
      if (!time) continue;
      const key = dayKey(time);
      classDays.set(key, { time, count: (classDays.get(key)?.count || 0) + 1 });
    }
    for (const [key, { time, count }] of classDays) {
      if (time <= now) {
        activity.push({
          type: "attendance",
          id: `attendance-${course.courseId}-${key}`,
          time,
          title: "Attendance recorded",
          detail: `${title} · ${count} student${count === 1 ? "" : "s"}`,
        });
      }
    }

    const startTime = toTime(course.startDate);
    return {
      id: course.courseId,
      title,
      enrolled: Number(course.enrolledCount) || 0,
      creditHours: course.creditHours,
      startTime,
      hasStarted: !startTime || startTime <= now,
      marks: marks.length,
      present: marks.filter((mark) => mark.status === "present").length,
      markedToday: classDays.has(today),
    };
  });

  const byNewest = (a, b) => b.time - a.time;
  const latest = (type) => activity.filter((event) => event.type === type).sort(byNewest).slice(0, 4);
  const recentActivity = [...latest("submission"), ...latest("attendance")]
    .sort(byNewest)
    .slice(0, 6)
    .map((event) =>
      event.type === "submission"
        ? {
            ...event,
            title: `${event.student?.name || studentNames.get(event.student) || "A student"} submitted an assignment`,
            when: timeAgo(event.time),
          }
        : { ...event, when: dayLabel(event.time) }
    );

  const totalMarks = courseRows.reduce((sum, course) => sum + course.marks, 0);
  const totalPresent = courseRows.reduce((sum, course) => sum + course.present, 0);
  const pending = assignments.filter((assignment) => assignment.ungraded > 0).sort((a, b) => b.ungraded - a.ungraded);

  return {
    courses: courseRows,
    totalStudents: courseRows.reduce((sum, course) => sum + course.enrolled, 0),
    totalCreditHours: courseRows.reduce((sum, course) => sum + (Number(course.creditHours) || 0), 0),
    todaysClasses: courseRows.filter((course) => course.hasStarted),
    pending: pending.slice(0, 5),
    pendingCount: pending.reduce((sum, assignment) => sum + assignment.ungraded, 0),
    pendingAssignments: pending.length,
    upcoming: assignments
      .filter((assignment) => assignment.dueTime && assignment.dueTime >= new Date(today).getTime())
      .sort((a, b) => a.dueTime - b.dueTime)
      .slice(0, 5),
    attendance: { total: totalMarks, present: totalPresent, courses: courseRows.filter((course) => course.marks > 0) },
    recentActivity,
  };
}

function StaffDashboard() {
  const [state, setState] = useState({ status: "loading", data: null, isDemo: false, isPartial: false });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      setState({ status: "ready", ...(await fetchStaffDashboard()) });
    } catch (err) {
      setState({ status: "error", data: null, isDemo: false, isPartial: false });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const view = useMemo(() => (state.data ? buildView(state.data) : null), [state.data]);
  const isLoading = state.status === "loading";

  // With a single course the course actions can go straight to it; otherwise they
  // jump to the course list, where each course has its own buttons.
  const onlyCourse = view?.courses.length === 1 ? view.courses[0] : null;
  const quickActions = [
    {
      label: "Take Attendance",
      to: onlyCourse ? `/staff/courses/${onlyCourse.id}/attendance` : "/staff#assigned-courses",
      icon: ClipboardDocumentCheckIcon,
    },
    { label: "Create Assignment", to: "/staff/assignments", icon: DocumentPlusIcon },
    { label: "Grade Submissions", to: "/staff/submitted-assignments", icon: ClipboardDocumentListIcon },
    {
      label: "View Students",
      to: onlyCourse ? `/staff/courses/${onlyCourse.id}/students` : "/staff#assigned-courses",
      icon: UserGroupIcon,
    },
  ];

  return (
    <PortalPage
      title="Staff Dashboard"
      description="Your courses, grading and attendance at a glance."
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
          <DashboardNotice>Some course details could not be loaded and may be incomplete. Try refreshing.</DashboardNotice>
        )}

        {isLoading && <DashboardSkeleton />}

        {state.status === "error" && <DashboardError onRetry={load} />}

        {state.status === "ready" && view && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={BookOpenIcon}
                label="Assigned Courses"
                value={formatNumber(view.courses.length)}
                caption={view.courses.length ? `${view.totalCreditHours} credit hours` : "No courses yet"}
              />
              <StatCard
                icon={AcademicCapIcon}
                label="Students"
                value={formatNumber(view.totalStudents)}
                caption="Across your courses"
              />
              <StatCard
                icon={InboxIcon}
                label="Pending Submissions"
                value={formatNumber(view.pendingCount)}
                caption={
                  view.pendingCount
                    ? `In ${view.pendingAssignments} assignment${view.pendingAssignments === 1 ? "" : "s"}`
                    : "Nothing to grade"
                }
              />
              <StatCard
                icon={ClipboardDocumentCheckIcon}
                label="Attendance"
                value={view.attendance.total ? `${percent(view.attendance.present, view.attendance.total)}%` : "–"}
                caption={view.attendance.total ? "Average across courses" : "No records yet"}
              />
            </div>

            <Panel title="Quick actions">
              <QuickActions actions={quickActions} />
            </Panel>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Panel title="Today's classes" subtitle={formatDate(Date.now())}>
                {view.todaysClasses.length > 0 ? (
                  <ul className="-my-3 divide-y divide-line">
                    {view.todaysClasses.map((course) => (
                      <li key={course.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{course.title}</p>
                          <p className="text-sm text-ink-secondary">{formatNumber(course.enrolled)} students</p>
                        </div>
                        {course.markedToday ? (
                          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink">
                            <CheckCircleIcon className="h-5 w-5 text-success" aria-hidden="true" />
                            Marked
                          </span>
                        ) : (
                          <Link to={`/staff/courses/${course.id}/attendance`} className={`shrink-0 ${buttonClass}`}>
                            Take attendance
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={CalendarDaysIcon}
                    title="No classes today"
                    hint="Courses you teach appear here once they have started."
                  />
                )}
              </Panel>

              <Panel
                title="Pending grading"
                action={<PanelLink to="/staff/submitted-assignments">All submissions</PanelLink>}
              >
                {view.pending.length > 0 ? (
                  <ul className="-my-3 divide-y divide-line">
                    {view.pending.map((assignment) => (
                      <li key={assignment.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                          <p className="truncate text-sm text-ink-secondary">
                            {assignment.courseTitle} · {assignment.ungraded} to grade
                          </p>
                        </div>
                        <Link to={`/staff/assignments/${assignment.id}/grade`} className={`shrink-0 ${buttonClass}`}>
                          Grade
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={CheckCircleIcon}
                    title="Nothing to grade"
                    hint="New submissions that need a grade will appear here."
                  />
                )}
              </Panel>

              <Panel
                title="Upcoming assignments"
                action={<PanelLink to="/staff/assignments">Create</PanelLink>}
                className="md:col-span-2 xl:col-span-1"
              >
                {view.upcoming.length > 0 ? (
                  <ul className="-my-3 divide-y divide-line">
                    {view.upcoming.map((assignment) => (
                      <li key={assignment.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                          <p className="truncate text-sm text-ink-secondary">
                            {assignment.courseTitle} · {assignment.submitted} submitted
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium text-ink">{dueLabel(assignment.dueTime)}</p>
                          <p className="text-xs text-ink-secondary">{formatDate(assignment.dueTime)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={DocumentPlusIcon}
                    title="No upcoming assignments"
                    hint="Assignments with a due date ahead will be listed here."
                    to="/staff/assignments"
                    cta="Create an assignment"
                  />
                )}
              </Panel>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Panel
                id="assigned-courses"
                title="Assigned courses"
                subtitle="Courses you are teaching"
                className="scroll-mt-6 xl:col-span-2"
              >
                {view.courses.length > 0 ? (
                  <ul className="-my-4 divide-y divide-line">
                    {view.courses.map((course) => (
                      <li key={course.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{course.title}</p>
                          <p className="mt-0.5 text-sm text-ink-secondary">
                            {formatNumber(course.enrolled)} students
                            {course.creditHours ? ` · ${course.creditHours} credit hours` : ""}
                            {course.startTime
                              ? ` · ${course.hasStarted ? "Started" : "Starts"} ${formatDate(course.startTime)}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <Link to={`/staff/courses/${course.id}/students`} className={buttonClass}>
                            Students
                          </Link>
                          <Link to={`/staff/course/${course.id}/details`} className={buttonClass}>
                            Course
                          </Link>
                          <Link to={`/staff/courses/${course.id}/attendance`} className={buttonClass}>
                            Attendance
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={BookOpenIcon}
                    title="No assigned courses"
                    hint="Courses appear here once an administrator assigns you as the instructor."
                  />
                )}
              </Panel>

              <Panel title="Attendance overview">
                {view.attendance.total > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-ink">
                        {percent(view.attendance.present, view.attendance.total)}%
                      </p>
                      <p className="mt-0.5 text-sm text-ink-secondary">
                        Present across {formatNumber(view.attendance.total)} recorded attendances
                      </p>
                    </div>
                    {view.attendance.courses.map((course) => (
                      <Meter key={course.id} label={course.title} value={percent(course.present, course.marks)} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ClipboardDocumentCheckIcon}
                    title="No attendance recorded"
                    hint="Attendance rates appear once you mark attendance for a class."
                  />
                )}
              </Panel>
            </div>

            <Panel title="Recent activity">
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
                  hint="Student submissions and recorded attendance will appear here."
                />
              )}
            </Panel>
          </>
        )}
    </PortalPage>
  );
}

export default StaffDashboard;
