import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function ViewStudents() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/${courseId}/students`, {
          withCredentials: true,
        });
        setStudents(res.data.enrolledStudents);
        setFilteredStudents(res.data.enrolledStudents);
      } catch (err) {
        setError("Failed to load students.");
      }
      setLoading(false);
    };

    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading Students...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Enrolled Students</h1>

        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-100">
                    <td className="p-3 border">{student.name}</td>
                    <td className="p-3 border">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No students enrolled.</p>
        )}

        <button
          onClick={() => navigate("/staff")}
          className="mt-6 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ViewStudents;
