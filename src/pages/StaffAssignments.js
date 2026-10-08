import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function StaffAssignments() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/dashboard`, {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load courses." });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/assignments/create`,
        formData,
        { withCredentials: true }
      );
      setAssignments([...assignments, res.data.assignment]);
      setMessage({ type: "success", text: "Assignment Created Successfully!" });
      setTimeout(() => navigate("/staff"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Error creating assignment." });
    }
  };

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading Assignments...</h1>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Manage Assignments</h1>
        <p className="text-center text-gray-600 mb-4">Welcome, {user?.name}</p>

        {message && (
          <div className={`text-center text-lg font-medium mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={createAssignment} className="space-y-4 bg-gray-100 p-6 rounded-md">
          <h2 className="text-xl font-semibold text-gray-700">Create New Assignment</h2>

          <div>
            <label className="block text-gray-700 font-medium">Course</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Assignment
          </button>
        </form>

        <h2 className="text-2xl font-semibold mt-6 text-center text-gray-700">Existing Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {assignments.map((assignment) => (
              <li key={assignment._id} className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  <p className="text-gray-600">{assignment.description}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-4">No assignments yet.</p>
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

export default StaffAssignments;
