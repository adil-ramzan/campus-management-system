import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaTasks, FaClipboardList, FaBell, FaChartLine } from "react-icons/fa";
import { MdPendingActions, MdDateRange, MdSchool } from "react-icons/md";
import { API_URL } from "../config";

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [studentDetails, setStudentDetails] = useState({});
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, announcementRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/api/student/dashboard`, { withCredentials: true }),
          axios.get(`${API_URL}/api/student/announcements`, { withCredentials: true }),
          axios.get(`${API_URL}/api/student/progress`, { withCredentials: true }),
        ]);

        setStudentDetails(dashboardRes.data.studentDetails || {});
        setCourses(dashboardRes.data.dashboardData || []);
        setAnnouncements(announcementRes.data || []);
        setWeeklyProgress(progressRes.data.weeklyProgress || 0);
      } catch (err) {
        setError("Failed to fetch data.");
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading dashboard...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700">🎓 Student Dashboard</h1>
        <p className="text-gray-700 text-lg mt-2">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <MdSchool className="mr-2 text-blue-600" /> Student Details
        </h2>
        <p className="text-gray-700 mt-2"><strong>Course:</strong> {studentDetails.course || "N/A"}</p>
        <p className="text-gray-700"><strong>Session:</strong> {studentDetails.session || "N/A"}</p>
        <p className="text-gray-700"><strong>Semester:</strong> {studentDetails.semester || "N/A"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaChartLine className="mr-2 text-green-600" /> Weekly Progress
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-6 mt-4">
          <div className="bg-blue-600 h-6 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${weeklyProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-700 font-bold mt-2">Progress: {weeklyProgress}%</p>
      </div>

      <div className="mt-8 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FaBell className="mr-2 text-yellow-500" /> Recent Announcements
        </h2>
        {announcements.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {announcements.map((announcement) => (
              <li key={announcement._id} className="bg-yellow-100 p-3 rounded-md shadow-md">
                <h3 className="text-lg font-bold">{announcement.title}</h3>
                <p className="text-gray-700">{announcement.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No new announcements.</p>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.map((course) => (
  <div
    key={course.courseId}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 flex flex-col justify-between"
  >
    <h2 className="text-2xl font-bold text-blue-700 flex items-center mb-1">
      <FaClipboardList className="mr-2 text-blue-500" />
      {course.courseTitle}
    </h2>

    <div className="text-gray-600 space-y-1 mb-4">
      <p className="flex items-center">
        <MdDateRange className="mr-2 text-gray-500" />
        Start Date: {course.startDate ? new Date(course.startDate).toLocaleDateString() : "Not Available"}
      </p>
      <p>
        <strong>Credit Hours:</strong> {course.creditHours || "N/A"}
      </p>
      <p
        className={`font-semibold ${
          course.attendancePercentage >= 75
            ? "text-green-600"
            : course.attendancePercentage < 50
            ? "text-red-600"
            : "text-yellow-500"
        }`}
      >
        Attendance: {course.attendancePercentage ?? 0}%
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
        <FaTasks className="mr-2 text-gray-700" /> Assignments
      </h3>

      {course.assignmentSummary.length > 0 ? (
        <ul className="space-y-3">
          {course.assignmentSummary.map((assignment) => (
            <li
              key={assignment.assignmentId}
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
            >
              <div className="text-sm text-gray-800">
                <p>
                  <strong>{assignment.title}</strong>{" "}
                  <span className="ml-2">
                    {assignment.submitted ? "✅ Submitted" : "❌ Not Submitted"}
                  </span>
                </p>
                {assignment.grade !== "N/A" && (
                  <p className="text-green-600 font-medium">Grade: {assignment.grade}</p>
                )}
                {assignment.feedback !== "No feedback" && (
                  <p className="text-gray-700">Feedback: {assignment.feedback}</p>
                )}
              </div>

              {!assignment.submitted && (
                <Link to={`/student/assignments/${assignment.assignmentId}/submit`}>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                    Submit Assignment
                  </button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No assignments yet.</p>
      )}
    </div>

    <div className="mt-6">
      <Link to={`/student/courses/${course.courseId}/attendance`}>
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex justify-center items-center gap-2">
          <MdPendingActions className="text-lg" />
          View Attendance
        </button>
      </Link>
    </div>
  </div>
))}

        </div>
      ) : (
        <p className="text-gray-600 mt-6 text-center">No enrolled courses.</p>
      )}
    </div>
  );
}

export default StudentDashboard;
