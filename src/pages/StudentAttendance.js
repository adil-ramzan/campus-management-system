import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Badge, Card, EmptyState, ErrorState, LoadingState, Table, Td, Th, Tr } from "../components/ui";
import { formatDate } from "../components/DashboardUI";

function StudentAttendance() {
  const { courseId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/student/courses/${courseId}/attendance`,
          { withCredentials: true }
        );
        setAttendance(res.data.attendance || []);
      } catch (err) {
        setError("Failed to load attendance records.");
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [courseId]);

  const presentCount = attendance.filter((att) => att.status === "present").length;

  return (
    <PortalPage
      title="Attendance Records"
      description="Your attendance for this course, class by class."
      back={{ label: "Dashboard", to: "/student" }}
    >
      {loading ? (
        <LoadingState label="Loading attendance..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : attendance.length > 0 ? (
        <>
          <p className="text-sm text-ink-secondary">
            Present in <span className="font-medium text-ink">{presentCount}</span> of{" "}
            <span className="font-medium text-ink">{attendance.length}</span> recorded classes
          </p>
          <Table caption="Attendance records">
            <thead>
              <tr>
                <Th>Date</Th>
                <Th className="text-right">Status</Th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att) => (
                <Tr key={att._id}>
                  <Td className="whitespace-nowrap">{formatDate(att.date)}</Td>
                  <Td className="text-right">
                    <Badge tone={att.status === "present" ? "success" : "danger"}>
                      {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Card>
          <EmptyState icon={ClipboardDocumentCheckIcon} title="No attendance records found." />
        </Card>
      )}
    </PortalPage>
  );
}

export default StudentAttendance;
