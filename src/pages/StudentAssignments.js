import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function StudentAssignments() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/assignments/student`, {
          withCredentials: true,
        });
        setAssignments(res.data || []);
      } catch (err) {
        setLoadError("Failed to load assignments. Please try again.");
      }
      setLoading(false);
    };

    fetchAssignments();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleAssignmentSelect = (event) => {
    setSelectedAssignment(event.target.value);
  };

  const submitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !selectedFile) {
      setError("Please select an assignment and upload a valid file.");
      return;
    }

    setSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.append("assignmentFile", selectedFile);

    try {
      await axios.post(
        `${API_URL}/api/assignments/submit/${selectedAssignment}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Assignment Submitted Successfully!");
      navigate("/student");
    } catch (err) {
      setError("Failed to submit assignment. Try again.");
    }

    setSubmitting(false);
  };

  if (loading)
    return <h1 className="text-blue-500 text-center mt-10">Loading assignments...</h1>;
  if (loadError)
    return <h1 className="text-red-500 text-center mt-10">{loadError}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          📌 Your Assignments
        </h1>
        <p className="text-center text-gray-700 mb-4">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </p>

        {assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment._id} className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-gray-500">
                  📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No assignments available.</p>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center">Submit Assignment</h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form onSubmit={submitAssignment} className="bg-gray-50 p-6 rounded-lg shadow space-y-4 mt-4">
            <div>
              <label className="block text-gray-700">📂 Select Assignment</label>
              <select
                value={selectedAssignment}
                onChange={handleAssignmentSelect}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="">Choose Assignment</option>
                {assignments.map((assignment) => (
                  <option key={assignment._id} value={assignment._id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700">📎 Upload File</label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              />
              <p className="text-sm text-gray-500 mt-1">Allowed: PDF, DOCX, TXT (Max: 10MB)</p>
            </div>

            <button
              type="submit"
              className={`w-full px-6 py-2 rounded-lg text-white transition ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentAssignments;
