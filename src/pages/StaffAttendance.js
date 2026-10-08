import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function StaffAttendance() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/${courseId}/students`, {
          withCredentials: true,
        });
        setStudents(res.data.enrolledStudents);
      } catch (err) {
        setError("Failed to load students.");
      }
      setLoading(false);
    };

    fetchStudents();
  }, [courseId]);

  const markAttendance = async (studentId) => {
    if (!studentId) {
      setMessage({ type: "error", text: "Please select a student." });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/staff/courses/${courseId}/attendance/${studentId}`,
        { date, status },
        { withCredentials: true }
      );
      setMessage({ type: "success", text: "Attendance marked successfully!" });

      setSelectedStudent("");
      setStatus("present");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to mark attendance." });
    }
  };

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-500 mb-4 text-center">Mark Attendance</h1>

        <label className="block text-gray-700 font-medium mb-2">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <label className="block text-gray-700 font-medium mb-2">Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        >
          <option value="">-- Choose Student --</option>
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        <label className="block text-gray-700 font-medium mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button
          onClick={() => markAttendance(selectedStudent)}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          disabled={!selectedStudent}
        >
          Mark Attendance
        </button>

        {message && (
          <p className={`mt-4 text-center text-lg font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}

        <button
          onClick={() => navigate("/staff")}
          className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default StaffAttendance;
