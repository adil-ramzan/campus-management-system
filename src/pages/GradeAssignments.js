import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowTopRightOnSquareIcon, InboxIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Badge, Button, Card, EmptyState, ErrorState, Field, Input, LoadingState, Textarea } from "../components/ui";

function GradeAssignments() {
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


  return (
    <PortalPage
      title="Grade Assignments"
      description="Review each submission, then record a grade and feedback."
      back={{ label: "Submissions", to: "/staff/submitted-assignments" }}
    >
      {loading ? (
        <LoadingState label="Loading submissions..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : submissions.length > 0 ? (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <Card as="li" key={submission._id} padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-ink">{submission.student.name}</h2>
                  <p className="truncate text-sm text-ink-secondary">{submission.student.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {submission.grade && <Badge tone="success">Graded: {submission.grade}</Badge>}
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ArrowTopRightOnSquareIcon}
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Submission
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-4 sm:p-6">
                <Field label="Grade">
                  <Input type="text" onChange={(e) => handleGradeChange(submission._id, "grade", e.target.value)} />
                </Field>
                <Field label="Feedback" className="sm:col-span-3">
                  <Textarea rows={2} onChange={(e) => handleGradeChange(submission._id, "feedback", e.target.value)} />
                </Field>
                <div className="flex justify-end sm:col-span-4">
                  <Button
                    onClick={() => submitGrade(submission._id)}
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? "Submitting..." : "Submit Grade"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ul>
      ) : (
        <Card>
          <EmptyState icon={InboxIcon} title="No submissions yet." />
        </Card>
      )}
    </PortalPage>
  );
}

export default GradeAssignments;
