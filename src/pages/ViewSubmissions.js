import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/staff/assignments/${assignmentId}/submissions`,
          { withCredentials: true }
        );
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to fetch submissions.");
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading submissions...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">📑 Assignment Submissions</h1>

        {submissions.length > 0 ? (
          <ul className="space-y-4">
            {submissions.map((submission) => (
              <li key={submission._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">{submission.student.name}</h2>
                <p className="text-gray-600">{submission.student.email}</p>
                <p className="text-gray-700 mt-2">📅 Submitted on: {new Date(submission.submittedAt).toLocaleDateString()}</p>

                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-block"
                >
                  Download Submission
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No submissions found.</p>
        )}

        <button
          onClick={() => window.history.back()}
          className="mt-6 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ViewSubmissions;
