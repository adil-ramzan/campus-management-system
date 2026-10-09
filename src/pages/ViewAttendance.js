import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SearchInput } from "../components/ui";
import { formatDate } from "../components/DashboardUI";

function ViewAttendance() {
  const { courseId } = useParams();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/staff/courses/${courseId}/attendance`,
          { withCredentials: true }
        );

        setAttendanceRecords(res.data);
        setFilteredRecords(res.data);
      } catch (err) {
        setError("Failed to load attendance records.");
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [courseId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();

    const filtered = attendanceRecords.filter((record) =>
      record.student.name.toLowerCase().includes(query) ||
      record.student.email.toLowerCase().includes(query)
    );

    setFilteredRecords(filtered);
  };

  return (
    <PortalPage
      title="Attendance Records"
      description="Attendance marked for each student in this course."
      back={{ label: "Dashboard", to: "/staff" }}
      actions={
        <Button to={`/staff/courses/${courseId}/attendance`} icon={ClipboardDocumentCheckIcon}>
          Mark attendance
        </Button>
      }
    >
      {loading ? (
        <LoadingState label="Loading attendance..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="max-w-sm">
            <SearchInput
              label="Search students"
              placeholder="Search student by name or email..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {filteredRecords.length > 0 ? (
            <ul className="space-y-4">
              {filteredRecords.map((record) => (
                <Card as="li" key={record.student._id} padded={false}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-ink">{record.student.name}</h2>
                      <p className="truncate text-sm text-ink-secondary">{record.student.email}</p>
                    </div>
                    <p className="text-sm text-ink-secondary">
                      {record.attendance.filter((att) => att.status === "present").length} of {record.attendance.length}{" "}
                      present
                    </p>
                  </div>
                  {record.attendance.length > 0 ? (
                    <ul className="divide-y divide-line px-5">
                      {record.attendance.map((att) => (
                        <li key={att._id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                          <span className="text-ink">{formatDate(att.date)}</span>
                          <Badge tone={att.status === "present" ? "success" : "danger"}>
                            {att.status === "present" ? "Present" : "Absent"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-5 py-4 text-sm text-ink-secondary">No attendance marked yet.</p>
                  )}
                </Card>
              ))}
            </ul>
          ) : (
            <Card>
              <EmptyState icon={ClipboardDocumentCheckIcon} title="No attendance records found." />
            </Card>
          )}
        </>
      )}
    </PortalPage>
  );
}

export default ViewAttendance;
