import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaUser,
  FaLock,
} from "react-icons/fa";

function HomePage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters long.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "staff") navigate("/staff");
      else if (result.role === "student") navigate("/student");
      else navigate("/");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-300 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/image.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-30 z-0 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl bg-white bg-opacity-95 backdrop-blur-md shadow-2xl rounded-lg p-10 flex flex-col md:flex-row items-center justify-between gap-10 border border-blue-100">

          <div className="md:w-1/2 space-y-5">
            <h2 className="text-4xl font-bold text-blue-700">Campus Management System</h2>
            <p className="text-gray-700 text-justify">
              A centralized platform built to manage student records, faculty assignments, course enrollments, and academic announcements with ease. Designed for universities and colleges to streamline academic operations.
            </p>

            <ul className="space-y-3 mt-4">
              <li className="flex items-center text-gray-800">
                <FaUserGraduate className="text-blue-600 mr-3 text-lg" />
                Role-based Dashboards for Admin, Staff & Students
              </li>
              <li className="flex items-center text-gray-800">
                <FaChalkboardTeacher className="text-green-600 mr-3 text-lg" />
                Real-time Course & Attendance Management
              </li>
              <li className="flex items-center text-gray-800">
                <FaClipboardList className="text-purple-600 mr-3 text-lg" />
                Assignment Submissions & Grading
              </li>
            </ul>
          </div>

          <div className="md:w-1/2 w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">

              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    if (e.target.value.length <= 15) {
                      setPassword(e.target.value);
                    }
                  }}
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                ) : (
                  "Login"
                )}
              </button>

              {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              New student?{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
