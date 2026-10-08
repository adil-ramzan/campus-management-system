import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function StudentAttendance() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/student/courses/${courseId}/attendance`,
          { withCredentials: true }
        );
        setAttendance(res.data.attendance || []);
      } catch (err) {
        setError("Failed to load attendance records.");
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [courseId]);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading attendance...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">📅 Attendance Records</h1>

        {attendance.length > 0 ? (
          <ul className="list-none space-y-4">
            {attendance.map((att) => (
              <li key={att._id} className="flex justify-between bg-white p-4 rounded-lg shadow-sm">
                <span className="text-gray-700">{new Date(att.date).toLocaleDateString()}</span>
                <span
                  className={`px-3 py-1 rounded-md ${
                    att.status === "present" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                  }`}
                >
                  {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No attendance records found.</p>
        )}

        <button
          onClick={() => navigate("/student")}
          className="mt-6 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default StudentAttendance;
