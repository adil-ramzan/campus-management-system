import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUserEdit, FaLock, FaTrashAlt } from "react-icons/fa"; // Import icons
import { API_URL } from "../config";

const EditStaff = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/staff/${staffId}`, { withCredentials: true });
        setFormData({ name: res.data.name });
      } catch (error) {
        console.error("Error fetching staff member", error);
      }
    };

    fetchStaff();
  }, [staffId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/api/admin/staff/${staffId}`, formData, { withCredentials: true });
      alert("✅ Staff member updated successfully!");
      navigate("/admin/instructors");
    } catch (error) {
      console.error("Error updating staff member", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("❌ Are you sure you want to delete this staff member? This action cannot be undone!")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/staff/${staffId}`, { withCredentials: true });
      alert("🗑️ Staff member deleted successfully!");
      navigate("/admin/instructors");
    } catch (error) {
      console.error("Error deleting staff member", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6 flex items-center justify-center gap-2">
          <FaUserEdit className="text-blue-500" /> Edit Staff
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">Staff Name:</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <FaUserEdit className="text-gray-500 mr-2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Old Password:</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-200 cursor-not-allowed">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="text"
                value="**********"
                className="w-full bg-transparent focus:outline-none cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">New Password:</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword || ""}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter new password (optional)"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all w-full mr-2"
            >
              <FaUserEdit /> Update Staff
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 shadow-md transition-all w-full ml-2"
            >
              <FaTrashAlt /> Delete Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
