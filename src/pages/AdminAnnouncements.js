import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { API_URL } from "../config";

function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/announcements`, { withCredentials: true });
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/admin/announcements`,
        { title, content, dueDate },
        { withCredentials: true }
      );

      setMessage({ type: "success", text: res.data.message });
      setTitle("");
      setContent("");
      setDueDate("");
      fetchAnnouncements();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create announcement" });
    }

    setLoading(false);
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/announcements/${announcementId}`, { withCredentials: true });
      setAnnouncements(announcements.filter((ann) => ann._id !== announcementId));
    } catch (error) {
      console.error("Error deleting announcement", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">📢 Create Announcement</h1>

        {message && (
          <p className={`mb-4 text-center font-semibold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Announcement"}
          </button>
        </form>
      </div>

      {/* Announcements List */}
      <div className="w-full max-w-lg mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📢 All Announcements</h2>
        {announcements.length > 0 ? (
          <ul className="space-y-4">
            {announcements.map((announcement) => (
              <li key={announcement._id} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.content}</p>
                  <p className="text-sm text-gray-500">Expires on: {new Date(announcement.dueDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(announcement._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No active announcements.</p>
        )}
      </div>
    </div>
  );
}

export default AdminAnnouncements;
