import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function EnrollStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const studentsRes = await axios.get(`${API_URL}/api/admin/students`, {
          withCredentials: true,
        });
        const coursesRes = await axios.get(`${API_URL}/api/admin/courses`, {
          withCredentials: true,
        });

        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentsAndCourses();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) {
      setMessage({ type: "error", text: "Please select a student and a course." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/courses/${selectedCourse}/enroll/${selectedStudent}`,
        {},
        { withCredentials: true }
      );

      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to enroll student" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Enroll Student</h1>

        <form onSubmit={handleEnroll} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose Student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Enroll Student"
            )}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-lg font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default EnrollStudent;
