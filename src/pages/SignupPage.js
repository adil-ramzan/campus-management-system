import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SignupPage() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signup({ name, email, password });
    setLoading(false);

    if (result.success) {
      navigate(result.role ? "/student" : "/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">Create a student account</h1>

        {error && (
          <p role="alert" className="mb-4 rounded-md bg-red-100 p-3 text-center text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Full name</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
              maxLength={15}
            />
            <span className="mt-1 block text-xs text-gray-500">Use 8 to 15 characters.</span>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
              maxLength={15}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-gray-500">
          Admin and staff accounts must be provided by an administrator.
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
