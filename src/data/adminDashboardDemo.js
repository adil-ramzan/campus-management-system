// Demo data for the Admin Dashboard. It is shown only when the API cannot be reached,
// and the dashboard labels it as demo data. The shapes mirror the /api/admin/* responses,
// so the dashboard derives its figures from it exactly as it does from live data.

const HOUR = 60 * 60 * 1000;
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR).toISOString();
const daysAgo = (days) => hoursAgo(days * 24);

const PROGRAMS = [
  ["BSCS", 164],
  ["BSSE", 142],
  ["BSIT", 96],
  ["BBA", 84],
];
const SESSIONS = ["21-25", "22-26", "23-27", "24-28"];
const FIRST_NAMES = ["Ayesha", "Bilal", "Hira", "Usman", "Maryam", "Hamza", "Zainab", "Saad", "Noor", "Imran"];
const LAST_NAMES = ["Khan", "Ahmed", "Malik", "Raza", "Qureshi", "Shah", "Iqbal"];

// [title, instructor, enrolled students, credit hours, share of classes attended]
const COURSES = [
  ["Data Structures & Algorithms", "Dr. Farah Siddiqui", 86, 4, 0.91],
  ["Database Systems", "Dr. Kamran Yousaf", 78, 4, 0.88],
  ["Software Engineering", "Ms. Sana Tariq", 72, 3, 0.93],
  ["Operating Systems", "Dr. Adnan Rauf", 64, 4, 0.84],
  ["Computer Networks", "Mr. Faisal Mehmood", 58, 3, 0.86],
  ["Web Engineering", "Ms. Sana Tariq", 51, 3, 0.9],
  ["Discrete Mathematics", "Dr. Nadia Aslam", 44, 3, 0.79],
  ["Principles of Marketing", "Mr. Omar Sheikh", 37, 3, 0.82],
];

// [title, index into COURSES, submissions, graded submissions]
const ASSIGNMENTS = [
  ["ER Diagram for a Library System", 1, 61, 48],
  ["Linked List Implementation", 0, 70, 70],
  ["Requirements Specification", 2, 54, 31],
  ["Process Scheduling Simulation", 3, 39, 12],
  ["Responsive Landing Page", 5, 44, 44],
];

const ANNOUNCEMENTS = [
  ["Mid-term examination schedule", "The mid-term date sheet for all programs is now available at the examination office and on department notice boards.", 5, 14],
  ["Fee submission deadline", "Students must clear their semester dues before the deadline to remain eligible for the mid-term examinations.", 52, 9],
  ["Library hours extended", "The central library will stay open until 10 pm on weekdays during the examination period.", 120, 30],
  ["Guest lecture on cloud computing", "The Department of Computer Science invites all students to a guest lecture in the main auditorium.", 216, 5],
];

const CLASS_DAYS = 10;

export function getAdminDashboardDemo() {
  let studentIndex = 0;
  const students = PROGRAMS.flatMap(([program, count]) =>
    Array.from({ length: count }, (_, i) => {
      const k = studentIndex++;
      const name = `${FIRST_NAMES[k % FIRST_NAMES.length]} ${LAST_NAMES[(k * 3) % LAST_NAMES.length]}`;
      return {
        _id: `demo-student-${k}`,
        name,
        email: `${name.toLowerCase().replace(" ", ".")}${k}@example.edu`,
        course: program,
        session: SESSIONS[i % SESSIONS.length],
        createdAt: daysAgo(1 + k * 2),
      };
    })
  );

  const courses = COURSES.map(([title, instructor, enrolled, creditHours, attendanceRate], c) => ({
    _id: `demo-course-${c}`,
    title,
    instructor: { _id: `demo-staff-${c}`, name: instructor },
    creditHours,
    startDate: daysAgo(45),
    createdAt: c < 2 ? daysAgo(1 + c * 3) : undefined,
    studentsEnrolled: Array.from({ length: enrolled }, (_, i) => ({
      student: students[(i * 3 + c * 11) % students.length]._id,
      attendance: Array.from({ length: CLASS_DAYS }, (_, d) => ({
        _id: `demo-attendance-${c}-${i}-${d}`,
        date: daysAgo(d * 2 + 1),
        status: (i * 37 + d * 17 + c * 5) % 100 < attendanceRate * 100 ? "present" : "absent",
      })),
    })),
  }));

  const assignments = ASSIGNMENTS.map(([title, courseIndex, submitted, graded], a) => ({
    _id: `demo-assignment-${a}`,
    title,
    course: courses[courseIndex]._id,
    dueDate: daysAgo(-7),
    submissions: Array.from({ length: submitted }, (_, i) => ({
      _id: `demo-submission-${a}-${i}`,
      student: courses[courseIndex].studentsEnrolled[i % courses[courseIndex].studentsEnrolled.length].student,
      submittedAt: hoursAgo(2 + a * 5 + i * 9),
      grade: i < graded ? "A" : null,
    })),
  }));

  const announcements = ANNOUNCEMENTS.map(([title, content, postedHoursAgo, expiresInDays], n) => ({
    _id: `demo-announcement-${n}`,
    title,
    content,
    createdAt: hoursAgo(postedHoursAgo),
    dueDate: daysAgo(-expiresInDays),
  }));

  const totalStaff = 18;
  return {
    stats: {
      totalUsers: students.length + totalStaff + 2,
      totalStudents: students.length,
      totalStaff,
      totalCourses: courses.length,
      totalAssignments: assignments.length,
    },
    courses,
    assignments,
    students,
    announcements,
  };
}
