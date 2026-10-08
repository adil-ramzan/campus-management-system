import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ManageUsers() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/admin/create-user`, formData, { withCredentials: true });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Manage Users</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2">Name</label>
        <input type="text" name="name" onChange={handleChange} required className="w-full border p-2 mb-4" />

        <label className="block mb-2">Email</label>
        <input type="email" name="email" onChange={handleChange} required className="w-full border p-2 mb-4" />

        <label className="block mb-2">Password</label>
        <input type="password" name="password" onChange={handleChange} required className="w-full border p-2 mb-4" />

        <label className="block mb-2">Role</label>
        <select name="role" onChange={handleChange} className="w-full border p-2 mb-4">
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>

        <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded">Create User</button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default ManageUsers;
