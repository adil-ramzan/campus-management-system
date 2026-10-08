import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

function UpdateCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", instructor: "" });
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/courses`);
        const course = res.data.find((c) => c._id === courseId);
        if (course) {
          setFormData({
            title: course.title,
            description: course.description,
            instructor: course.instructor ? course.instructor._id : "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
      }
    };

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

    fetchCourseDetails();
    fetchInstructors();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/admin/courses/${courseId}`, formData, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin/manage-courses"), 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update course",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Update Course</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Instructor</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition duration-200"
          >
            Update Course
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

export default UpdateCourse;
