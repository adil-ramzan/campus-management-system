import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { API_URL } from "../config";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalCourses: 0,
    totalAssignments: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, { withCredentials: true });
        setStats(res.data);

        const courseRes = await axios.get(`${API_URL}/api/admin/courses`, { withCredentials: true });
        setCourseData(courseRes.data || []);

        const assignmentRes = await axios.get(`${API_URL}/api/admin/assignments`, { withCredentials: true });
        setAssignmentData(assignmentRes.data || []);
      } catch (err) {
        setError("Failed to fetch data.");
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <h1 className="text-center text-blue-600 text-xl">Loading...</h1>;
  if (error) return <h1 className="text-center text-red-600 text-xl">{error}</h1>;

  const studentPerCourseChart = {
    labels: courseData.length ? courseData.map(course => course.title) : ["No Courses"],
    datasets: [
      {
        label: "Students Enrolled",
        data: courseData.length ? courseData.map(course => course.studentsEnrolled.length) : [0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const gradedAssignments = assignmentData.reduce((acc, assignment) => {
    const graded = assignment.submissions.filter(sub => sub.grade).length;
    const ungraded = assignment.submissions.length - graded;
    return { graded: acc.graded + graded, ungraded: acc.ungraded + ungraded };
  }, { graded: 0, ungraded: 0 });

  const gradedAssignmentChart = {
    labels: ["Graded", "Ungraded"],
    datasets: [
      {
        data: [gradedAssignments.graded, gradedAssignments.ungraded],
        backgroundColor: ["#4CAF50", "#FF5733"],
      },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
<div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:shrink-0 md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 p-6 shadow-lg md:block`}>
  <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 md:hidden">
    <XMarkIcon className="h-6 w-6 text-white" />
  </button>
  <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
  <ul className="space-y-4">
    <li><button onClick={() => navigate("/admin")} className="w-full text-left">Dashboard</button></li>
    <li><button onClick={() => navigate("/admin/create-course")} className="w-full text-left">Create Course</button></li>
    <li><button onClick={() => navigate("/admin/enroll-student")} className="w-full text-left">Enroll Student</button></li>
    <li><button onClick={() => navigate("/admin/manage-courses")} className="w-full text-left">Manage Courses</button></li>
    <li><button onClick={() => navigate("/admin/instructors")} className="w-full text-left">View Instructors</button></li>
    <li><button onClick={() => navigate("/admin/students")} className="w-full text-left">View Students</button></li>
    <li>
      <button
        onClick={() => navigate("/admin/create-user")}
        className="w-full text-left bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 shadow-md transition flex items-center space-x-2"
      >
        ➕ <span>Create User</span>
      </button>
    </li>
  </ul>
</div>


      <div className="flex-1 min-w-0 p-6">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mb-4 bg-white p-2 rounded shadow-md md:hidden">
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
        )}

        <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>

        <div className="w-full overflow-hidden rounded-lg shadow-md mb-6">
          <img src="/campusUni.jpg"
            alt="Campus"
            className="w-full h-60 object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Total Users</h2>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Total Students</h2>
            <p>{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Total Staff</h2>
            <p>{stats.totalStaff}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Total Courses</h2>
            <p>{stats.totalCourses}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Total Assignments</h2>
            <p>{stats.totalAssignments}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/admin/announcements")}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md transition flex items-center space-x-2"
          >
            📢 <span>Create Announcement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-center">Students Per Course</h2>
            <Bar data={studentPerCourseChart} />
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-center">Graded vs. Ungraded Assignments</h2>
            <Doughnut data={gradedAssignmentChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
