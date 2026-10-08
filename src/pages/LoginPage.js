import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">🔐 Login</h2>

        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-md mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={password}
              onChange={(e) => {
                if (e.target.value.length <= 15) {
                  setPassword(e.target.value);
                }
              }}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Forgot password? <span className="text-blue-500 hover:underline cursor-pointer">Reset here</span>
          </p>
          <p className="text-gray-600 mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
