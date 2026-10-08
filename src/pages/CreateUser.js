import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
    session: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "session") {
      let semester = "";
      if (value === "21-25") semester = "8th";
      else if (value === "22-26") semester = "6th";
      else if (value === "23-27") semester = "4th";
      else if (value === "24-28") semester = "2nd";

      updatedFormData = { ...updatedFormData, semester };
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.role === "student" && formData.session === "20-24") {
      setError("Cannot create students for session 20-24.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/create-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setSuccess("User created successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>
        </div>

        {formData.role === "student" && (
          <>
            <div className="mb-4">
              <label className="block font-medium">Course:</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Course</option>
                <option value="BSSE">BS Software Engineering</option>
                <option value="BSCS">BS Computer Science</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Session:</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Session</option>
                <option value="20-24">2020-2024</option>
                <option value="21-25">2021-2025</option>
                <option value="22-26">2022-2026</option>
                <option value="23-27">2023-2027</option>
                <option value="24-28">2024-2028</option>
              </select>
            </div>

            {formData.session && formData.session !== "20-24" && (
              <div className="mb-4">
                <label className="block font-medium">Semester:</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">{`Select Semester (${formData.semester})`}</option>
                  {formData.session === "21-25" && <option value="8th">8th Semester</option>}
                  {formData.session === "22-26" && <option value="6th">6th Semester</option>}
                  {formData.session === "23-27" && <option value="4th">4th Semester</option>}
                  {formData.session === "24-28" && <option value="2nd">2nd Semester</option>}
                </select>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
