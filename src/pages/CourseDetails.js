import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaUserTie, FaFileAlt, FaArrowLeft } from "react-icons/fa";
import { API_URL } from "../config";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/course/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data);
      } catch (err) {
        setError("Failed to fetch course details.");
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading course details...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">{course.title}</h1>
        <p className="text-gray-700 mt-2">{course.description}</p>

        <div className="mt-6 flex items-center">
          <FaUserTie className="text-blue-500 text-lg mr-2" />
          <h3 className="text-lg font-semibold">Instructor:</h3>
        </div>
        <p className="text-gray-700">{course.instructor?.name || "Not Assigned"}</p>

        <div className="mt-6">
          <div className="flex items-center">
            <FaUserGraduate className="text-green-500 text-lg mr-2" />
            <h3 className="text-lg font-semibold">Enrolled Students:</h3>
          </div>
          {course.studentsEnrolled.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {course.studentsEnrolled
                .filter((entry) => entry.student)
                .map((student) => (
                <li key={student.student._id} className="bg-gray-100 p-3 rounded-md shadow-sm">
                  <span className="font-medium">{student.student.name}</span>
                  <span className="text-gray-500 text-sm block">{student.student.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No students enrolled.</p>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center">
            <FaFileAlt className="text-yellow-500 text-lg mr-2" />
            <h3 className="text-lg font-semibold">Assignments:</h3>
          </div>
          {course.assignments.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {course.assignments.map((assignment) => {
                const ungradedSubmissions = assignment.submissions.length - assignment.submissions.filter((sub) => sub.grade).length;
                return (
                  <li key={assignment._id} className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center">
                    <div>
                      <span className="font-medium">{assignment.title}</span>
                      <span className="ml-2 text-gray-600">({assignment.submissions.length} submissions)</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={ungradedSubmissions > 0 ? "text-red-500" : "text-green-500"}>
                        {ungradedSubmissions > 0 ? `Ungraded: ${ungradedSubmissions}` : "✅ All Graded"}
                      </span>

                      {assignment.submissions.length > 0 && (
                        <button
                          onClick={() => navigate(`/staff/assignments/${assignment._id}/grade`)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          Grade
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No assignments yet.</p>
          )}
        </div>

        <button
          onClick={() => navigate("/staff")}
          className="mt-6 flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;
