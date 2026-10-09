import React, { useEffect, useState } from "react";
import axios from "axios";
import { InboxIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, EmptyState, ErrorState, LoadingState, Table, Td, Th, Tr } from "../components/ui";

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

  return (
    <PortalPage
      title="Submitted Assignments"
      description="Assignments with student submissions waiting to be reviewed."
      width="wide"
    >
      {loading ? (
        <LoadingState label="Loading assignments..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : assignments.length > 0 ? (
        <Table caption="Submitted assignments">
          <thead>
            <tr>
              <Th>Assignment</Th>
              <Th>Course</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <Tr key={assignment.assignmentId}>
                <Td className="min-w-[12rem] font-medium">{assignment.title}</Td>
                <Td className="text-ink-secondary">{assignment.courseTitle}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" to={`/staff/assignments/${assignment.assignmentId}/submissions`}>
                      View Submissions
                    </Button>
                    <Button size="sm" to={`/staff/assignments/${assignment.assignmentId}/grade`}>
                      Grade Assignment
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={InboxIcon}
            title="No submitted assignments."
            hint="Assignments appear here once students hand in their work."
          />
        </Card>
      )}
    </PortalPage>
  );
}

export default SubmittedAssignments;
