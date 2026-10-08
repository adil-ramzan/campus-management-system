import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import { MdAssignment, MdDateRange } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { API_URL } from "../config";

function StaffDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/dashboard`, {
          withCredentials: true,
        });
        setCourses(res.data || []);
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
        <h1 className="text-4xl font-bold text-blue-700">📚 Staff Dashboard</h1>
        <p className="text-gray-700 text-lg mt-2">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/staff/assignments">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition flex items-center space-x-2">
            <MdAssignment className="text-xl" /> <span>Manage Assignments</span>
          </button>
        </Link>

        <Link to="/staff/submitted-assignments">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-lg transition flex items-center space-x-2">
            <MdAssignment className="text-xl" /> <span>View Submitted Assignments</span>
          </button>
        </Link>
      </div>


      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                <FaChalkboardTeacher className="mr-2 text-blue-500" /> {course.courseTitle}
              </h2>
              <p className="text-gray-600 mt-1 flex items-center">
                <FaUsers className="mr-2 text-gray-500" /> Enrolled:{" "}
                <span className="font-bold ml-1">{course.enrolledCount}</span>
              </p>
              <p className="text-gray-500 mt-1 flex items-center">
                <MdDateRange className="mr-2 text-gray-500" /> Start Date:{" "}
                {course.startDate ? new Date(course.startDate).toLocaleDateString() : "Not Available"}
              </p>

              <p className="text-gray-700 font-semibold mt-1">
                Credit Hours: {course.creditHours || "N/A"}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/staff/courses/${course.courseId}/students`}>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
                    <FaUsers className="text-lg" /> <span>View Students</span>
                  </button>
                </Link>

                <button
                  onClick={() => navigate(`/staff/course/${course.courseId}/details`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                >
                  <FaClipboardList className="text-lg" /> <span>View Course</span>
                </button>

                <Link to={`/staff/courses/${course.courseId}/attendance`}>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center space-x-2">
                    <IoCheckmarkCircleOutline className="text-lg" /> <span>Mark Attendance</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-6 text-center">No assigned courses.</p>
      )}
    </div>
  );
}

export default StaffDashboard;
