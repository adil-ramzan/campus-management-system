import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function SubmittedAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/submitted-assignments`, {
          withCredentials: true,
        });
        setAssignments(res.data);
      } catch (err) {
        setError("Failed to fetch assignments.");
      }
      setLoading(false);
    };

    fetchAssignments();
  }, []);

  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading assignments...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">📌 Submitted Assignments</h1>

        {assignments.length > 0 ? (
            <ul className="space-y-4">
                {assignments.map((assignment) => (
                    <li key={assignment.assignmentId} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800">{assignment.title}</h2>
                        <p className="text-gray-600">Course: {assignment.courseTitle}</p>

                        <Link to={`/staff/assignments/${assignment.assignmentId}/submissions`}>
                            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                View Submissions
                            </button>
                        </Link>

                        <Link to={`/staff/assignments/${assignment.assignmentId}/grade`}>
                            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ml-2">
                                Grade Assignment
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        ) : (
        <p className="text-gray-500 text-center">No submitted assignments.</p>
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

export default SubmittedAssignments;
