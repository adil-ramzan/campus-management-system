import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

function GradeAssignments() {
  const { user } = useContext(AuthContext);
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gradeData, setGradeData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/assignments/submissions/${assignmentId}`, {
          withCredentials: true,
        });
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to load submissions.");
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (submissionId, field, value) => {
    setGradeData((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [field]: value },
    }));
  };

  const submitGrade = async (submissionId) => {
    if (!gradeData[submissionId]?.grade || !gradeData[submissionId]?.feedback) {
      alert("Please enter both grade and feedback.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(
        `${API_URL}/api/staff/assignments/${assignmentId}/grade/${submissionId}`,
        gradeData[submissionId],
        { withCredentials: true }
      );

      alert("Grade submitted successfully!");

      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId
            ? { ...submission, grade: gradeData[submissionId].grade }
            : submission
        )
      );

      setTimeout(() => {
        navigate("/staff");
      }, 500);
    } catch (err) {
      console.error("Error grading assignment:", err);
      alert("Error submitting grade.");
    }

    setSubmitting(false);
  };


  if (loading) return <h1 className="text-blue-500 text-center mt-10">Loading submissions...</h1>;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Grade Assignments</h1>
      <p>Welcome, {user?.name}</p>

      {submissions.length > 0 ? (
        <ul className="mt-3">
          {submissions.map((submission) => (
            <li key={submission._id} className="bg-white p-4 rounded shadow mb-2">
              <h3 className="text-lg font-semibold">{submission.student.name}</h3>
              <p>Email: {submission.student.email}</p>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Submission
              </a>

              <div className="mt-3">
                <label className="block text-gray-700">Grade</label>
                <input
                  type="text"
                  onChange={(e) => handleGradeChange(submission._id, "grade", e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Feedback</label>
                <textarea
                  onChange={(e) => handleGradeChange(submission._id, "feedback", e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <button
                onClick={() => submitGrade(submission._id)}
                className="mt-3 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Grade"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No submissions yet.</p>
      )}
    </div>
  );
}

export default GradeAssignments;
