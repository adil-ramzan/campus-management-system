import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/students`, { withCredentials: true });

        console.log("Fetched Students Data:", res.data); //Debugging Log

        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, []);


  useEffect(() => {
    let filtered = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    setFilteredStudents(filtered);
  }, [search, sortBy, students]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Student List</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />

        <select
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className="px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      <div className="w-full max-w-4xl mt-6">
        {filteredStudents.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Course</th>
                  <th className="py-3 px-6">Session</th>
                  <th className="py-3 px-6">Semester</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredStudents.map((student) => (
    <tr key={student._id} className="border-b hover:bg-gray-100">
      <td className="py-3 px-6">{student.name}</td>
      <td className="py-3 px-6">{student.email}</td>
      <td className="py-3 px-6">{student.course || "Not Set"}</td>
      <td className="py-3 px-6">{student.session || "Not Set"}</td>
      <td className="py-3 px-6">{student.semester || "Not Set"}</td>
      <td className="py-3 px-6">
        <button
          onClick={() => navigate(`/admin/edit-student/${student._id}`)}
          className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          ✏️ Edit
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No students found.</p>
        )}
      </div>
    </div>
  );
}

export default StudentList;
