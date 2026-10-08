import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    startDate: "",
    creditHours: "",
  });
  const [message, setMessage] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/instructors`, {
          withCredentials: true,
        });
        setInstructors(res.data);
      } catch (error) {
        console.error("Failed to fetch instructors", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.title || !formData.description || !formData.instructor || !formData.startDate || !formData.creditHours) {
      setMessage({ type: "error", text: "All fields, including Credit Hours, are required." });
      setLoading(false);
      return;
    }

    const validCreditHours = ["3", "4"];
    if (!validCreditHours.includes(formData.creditHours)) {
      setMessage({ type: "error", text: "Invalid Credit Hours selected." });
      setLoading(false);
      return;
    }

    console.log("Submitting course data:", formData); //  Debugging log

    try {
      const res = await axios.post(`${API_URL}/api/admin/courses`, formData, {
        withCredentials: true,
      });

      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create course" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Create Course</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Instructor</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Credit Hours</label>
            <select
              name="creditHours"
              value={formData.creditHours}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select credit hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-lg font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateCourse;
