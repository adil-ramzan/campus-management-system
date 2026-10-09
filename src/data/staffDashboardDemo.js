// Demo data for the Staff Dashboard. It is shown only when the API cannot be reached,
// and the dashboard labels it as demo data. The shapes mirror the /api/staff/* responses,
// so the dashboard derives its figures from it exactly as it does from live data.

const HOUR = 60 * 60 * 1000;
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR).toISOString();
const daysFromNow = (days) => hoursAgo(-days * 24);

const STUDENT_NAMES = [
  "Ayesha Khan",
  "Bilal Ahmed",
  "Hira Malik",
  "Usman Raza",
  "Maryam Qureshi",
  "Hamza Shah",
  "Zainab Iqbal",
  "Saad Farooq",
];

// [title, enrolled, credit hours, share of classes attended, attendance already marked today]
const COURSES = [
  ["Software Engineering", 72, 3, 0.93, true],
  ["Web Engineering", 51, 3, 0.9, false],
  ["Human Computer Interaction", 38, 4, 0.84, false],
];

// [title, index into COURSES, due in days, submissions, graded submissions]
const ASSIGNMENTS = [
  ["Requirements Specification", 0, -3, 54, 31],
  ["Use Case Diagrams", 0, 4, 18, 0],
  ["Responsive Landing Page", 1, -1, 44, 30],
  ["REST API Integration", 1, 9, 6, 0],
  ["Usability Evaluation Report", 2, 6, 12, 5],
];

const CLASS_DAYS = 8;

export function getStaffDashboardDemo() {
  const courses = COURSES.map(([courseTitle, enrolledCount, creditHours], c) => ({
    courseId: `demo-course-${c}`,
    courseTitle,
    enrolledCount,
    creditHours,
    startDate: daysFromNow(-40),
  }));

  const students = (c, count) =>
    Array.from({ length: count }, (_, i) => ({
      _id: `demo-student-${c}-${i}`,
      name: STUDENT_NAMES[(i + c * 3) % STUDENT_NAMES.length],
      email: `student${c}${i}@example.edu`,
    }));

  const details = {};
  const attendance = {};

  COURSES.forEach(([title, enrolled, , attendanceRate, markedToday], c) => {
    const roster = students(c, enrolled);
    const { courseId } = courses[c];

    details[courseId] = {
      _id: courseId,
      title,
      studentsEnrolled: roster.map((student) => ({ student })),
      assignments: ASSIGNMENTS.filter(([, courseIndex]) => courseIndex === c).map(
        ([assignmentTitle, , dueInDays, submitted, graded], a) => ({
          _id: `demo-assignment-${c}-${a}`,
          title: assignmentTitle,
          dueDate: daysFromNow(dueInDays),
          submissions: Array.from({ length: submitted }, (_, i) => ({
            _id: `demo-submission-${c}-${a}-${i}`,
            student: roster[i % roster.length]._id,
            submittedAt: hoursAgo(1 + c * 2 + a * 6 + i * 7),
            grade: i < graded ? "A" : null,
          })),
        })
      ),
    };

    attendance[courseId] = roster.map((student, i) => ({
      student,
      attendance: Array.from({ length: CLASS_DAYS }, (_, d) => ({
        _id: `demo-attendance-${c}-${i}-${d}`,
        date: hoursAgo((markedToday ? d : d + 1) * 48),
        status: (i * 37 + d * 17 + c * 5) % 100 < attendanceRate * 100 ? "present" : "absent",
      })),
    }));
  });

  return { courses, details, attendance };
}
