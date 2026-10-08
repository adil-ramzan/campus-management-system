import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/courses`, {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/courses/${courseId}`, {
        withCredentials: true,
      });
      const remaining = courses.filter((course) => course._id !== courseId);
      setCourses(remaining);
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(remaining.length / coursesPerPage))));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-blue-500 text-2xl font-bold">Loading Courses...</h1>
      </div>
    );
  if (error)
    return <h1 className="text-red-500 text-center mt-6">{error}</h1>;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
        Manage Courses
      </h1>

      {courses.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {currentCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h2>
                <p className="text-gray-600">{course.description}</p>
                {course.instructor && (
                  <p className="text-sm text-gray-500">
                    Instructor: {course.instructor.name || "N/A"}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/admin/update-course/${course._id}`)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 text-xl">No courses available.</p>
      )}

      {courses.length > coursesPerPage && (
        <div className="flex justify-center mt-6">
          {Array.from(
            { length: Math.ceil(courses.length / coursesPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/admin")}
          className="px-5 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ManageCourses;
