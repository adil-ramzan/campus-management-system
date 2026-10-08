import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function InstructorList() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/instructors`, {
          withCredentials: true,
        });
        setInstructors(res.data);
        setFilteredInstructors(res.data);
      } catch (error) {
        console.error("Error fetching instructors", error);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    let filtered = instructors.filter((inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    setFilteredInstructors(filtered);
  }, [search, sortBy, instructors]);

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member? This action cannot be undone!")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/staff/${staffId}`, { withCredentials: true });
      alert("Staff member deleted successfully!");
      setInstructors(instructors.filter(inst => inst._id !== staffId));
    } catch (error) {
      console.error("Error deleting staff", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Instructor List</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search instructor..."
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

      <div className="w-full max-w-3xl mt-6">
        {filteredInstructors.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((inst) => (
                  <tr key={inst._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6">{inst.name}</td>
                    <td className="py-3 px-6">{inst.email}</td>
                    <td className="py-3 px-6 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-staff/${inst._id}`)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inst._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No instructors found.</p>
        )}
      </div>
    </div>
  );
}

export default InstructorList;
