import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { API_URL } from "../config";

function ViewAttendance() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/staff/courses/${courseId}/attendance`,
          { withCredentials: true }
        );

        console.log("API Response:", res.data); // Debugging response
        setAttendanceRecords(res.data);
        setFilteredRecords(res.data);
      } catch (err) {
        setError("Failed to load attendance records.");
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [courseId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();

    const filtered = attendanceRecords.filter((record) =>
      record.student.name.toLowerCase().includes(query) ||
      record.student.email.toLowerCase().includes(query)
    );

    setFilteredRecords(filtered);
  };

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">📅 Attendance Records</h1>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>

        {filteredRecords.length > 0 ? (
          <ul className="list-none space-y-4">
            {filteredRecords.map((record) => (
              <li key={record.student._id} className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-800">{record.student.name}</h2>
                <p className="text-gray-600">{record.student.email}</p>

                <ul className="mt-2 space-y-2">
                  {record.attendance.map((att) => (
                    <li key={att._id} className="flex justify-between p-2 bg-white rounded-md shadow-sm border border-gray-200">
                      <span className="text-gray-700">{new Date(att.date).toLocaleDateString()}</span>
                      <span className={`flex items-center space-x-2 px-3 py-1 rounded-md ${att.status === "present" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                        {att.status === "present" ? (
                          <>
                            <IoCheckmarkCircleOutline className="text-green-700" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <IoCloseCircleOutline className="text-red-700" />
                            <span>Absent</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No attendance records found.</p>
        )}

        <button
          onClick={() => navigate("/staff")}
          className="mt-6 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ViewAttendance;
