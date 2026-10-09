// Demo data for the Student Dashboard. It is shown only when the API cannot be reached,
// and the dashboard labels it as demo data. The shapes mirror the student API responses,
// so the dashboard derives its figures from it exactly as it does from live data.

const HOUR = 60 * 60 * 1000;
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR).toISOString();
const daysFromNow = (days) => hoursAgo(-days * 24);

// [title, credit hours, classes held, classes missed (as indexes into the class days)]
const COURSES = [
  ["Software Engineering", 3, 12, [4]],
  ["Database Systems", 4, 12, [2, 9]],
  ["Web Engineering", 3, 10, []],
  ["Discrete Mathematics", 3, 11, [1, 5, 8]],
];

// [title, index into COURSES, due in days, submitted, grade, feedback]
const ASSIGNMENTS = [
  ["Requirements Specification", 0, -9, true, "A", "Clear and well structured. Add acceptance criteria next time."],
  ["Use Case Diagrams", 0, 3, false],
  ["ER Diagram for a Library System", 1, -5, true, "B+", "Good model. Two relationships are missing cardinality."],
  ["SQL Query Set 2", 1, 1, false],
  ["Responsive Landing Page", 2, -2, true],
  ["REST API Integration", 2, 8, false],
  ["Proof Techniques Worksheet", 3, 5, true],
];

const ANNOUNCEMENTS = [
  ["Mid-term examination schedule", "The mid-term date sheet for all programs is now available at the examination office and on department notice boards.", 5, 14],
  ["Fee submission deadline", "Students must clear their semester dues before the deadline to remain eligible for the mid-term examinations.", 52, 9],
  ["Library hours extended", "The central library will stay open until 10 pm on weekdays during the examination period.", 120, 30],
];

export function getStudentDashboardDemo() {
  const attendance = {};
  const assignments = [];

  const dashboardData = COURSES.map(([courseTitle, creditHours, classesHeld, missed], c) => {
    const courseId = `demo-course-${c}`;

    attendance[courseId] = Array.from({ length: classesHeld }, (_, d) => ({
      _id: `demo-attendance-${c}-${d}`,
      date: hoursAgo(d * 48 + c * 24),
      status: missed.includes(d) ? "absent" : "present",
    }));

    const assignmentSummary = ASSIGNMENTS.filter(([, courseIndex]) => courseIndex === c).map(
      ([title, , dueInDays, submitted, grade, feedback], a) => {
        const assignmentId = `demo-assignment-${c}-${a}`;
        assignments.push({ _id: assignmentId, title, course: courseId, dueDate: daysFromNow(dueInDays) });
        return { assignmentId, title, submitted, grade: grade || "N/A", feedback: feedback || "No feedback" };
      }
    );

    return {
      courseId,
      courseTitle,
      creditHours,
      startDate: daysFromNow(-40),
      attendancePercentage: Math.round(((classesHeld - missed.length) / classesHeld) * 100),
      assignmentSummary,
    };
  });

  const submitted = ASSIGNMENTS.filter(([, , , isSubmitted]) => isSubmitted).length;

  return {
    dashboard: {
      studentDetails: { course: "BSSE", session: "23-27", semester: "4th" },
      dashboardData,
    },
    announcements: ANNOUNCEMENTS.map(([title, content, postedHoursAgo, expiresInDays], n) => ({
      _id: `demo-announcement-${n}`,
      title,
      content,
      createdAt: hoursAgo(postedHoursAgo),
      dueDate: daysFromNow(expiresInDays),
    })),
    progress: { weeklyProgress: Math.round((submitted / ASSIGNMENTS.length) * 100) },
    assignments,
    attendance,
  };
}
