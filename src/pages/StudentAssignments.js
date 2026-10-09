import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, EmptyState, ErrorState, Field, FileInput, LoadingState, SectionCard, Select } from "../components/ui";
import { formatDate } from "../components/DashboardUI";

function StudentAssignments() {
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

  return (
    <PortalPage
      title="Your Assignments"
      description="See what has been set for your courses and hand in your work."
      back={{ label: "Dashboard", to: "/student" }}
      width="wide"
    >
      {loading ? (
        <LoadingState label="Loading assignments..." />
      ) : loadError ? (
        <ErrorState message={loadError} />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-5">
          <SectionCard
            title="Assignments"
            description={`${assignments.length} assigned`}
            className="lg:col-span-3"
          >
            {assignments.length > 0 ? (
              <ul className="-my-4 divide-y divide-line">
                {assignments.map((assignment) => (
                  <li key={assignment._id} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-sm font-semibold text-ink">{assignment.title}</h3>
                      <p className="text-xs text-ink-secondary">Due: {formatDate(assignment.dueDate)}</p>
                    </div>
                    <p className="mt-1 break-words text-sm leading-6 text-ink-secondary">{assignment.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={ClipboardDocumentListIcon} title="No assignments available." />
            )}
          </SectionCard>

          <SectionCard title="Submit Assignment" className="lg:col-span-2">
            <form onSubmit={submitAssignment} className="space-y-5">
              {error && <Alert tone="error">{error}</Alert>}

              <Field label="Select Assignment">
                <Select value={selectedAssignment} onChange={handleAssignmentSelect} required>
                  <option value="">Choose Assignment</option>
                  {assignments.map((assignment) => (
                    <option key={assignment._id} value={assignment._id}>
                      {assignment.title}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Upload File" hint="Allowed: PDF, DOCX, TXT (Max: 10MB)">
                <FileInput accept=".pdf,.docx,.txt" onChange={handleFileChange} required />
              </Field>

              <Button type="submit" className="w-full" loading={submitting} loadingLabel="Submitting...">
                Submit Assignment
              </Button>
            </form>
          </SectionCard>
        </div>
      )}
    </PortalPage>
  );
}

export default StudentAssignments;
