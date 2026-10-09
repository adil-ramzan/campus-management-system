import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ArrowDownTrayIcon, InboxIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, EmptyState, ErrorState, LoadingState, Table, Td, Th, Tr } from "../components/ui";
import { formatDate } from "../components/DashboardUI";

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

  return (
    <PortalPage
      title="Assignment Submissions"
      description="Work handed in by students for this assignment."
      back={{ label: "Back", onClick: () => window.history.back() }}
      width="wide"
      actions={<Button to={`/staff/assignments/${assignmentId}/grade`}>Grade assignment</Button>}
    >
      {loading ? (
        <LoadingState label="Loading submissions..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : submissions.length > 0 ? (
        <Table caption="Assignment submissions">
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Submitted on</Th>
              <Th className="text-right">File</Th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <Tr key={submission._id}>
                <Td className="min-w-[12rem]">
                  <p className="font-medium text-ink">{submission.student.name}</p>
                  <p className="text-ink-secondary">{submission.student.email}</p>
                </Td>
                <Td className="whitespace-nowrap text-ink-secondary">{formatDate(submission.submittedAt)}</Td>
                <Td className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ArrowDownTrayIcon}
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Submission
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <EmptyState icon={InboxIcon} title="No submissions found." />
        </Card>
      )}
    </PortalPage>
  );
}

export default ViewSubmissions;
