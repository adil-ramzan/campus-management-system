import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, Card, ErrorState, Field, FormActions, Input, LoadingState, Select } from "../components/ui";

function StaffAttendance() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/${courseId}/students`, {
          withCredentials: true,
        });
        setStudents(res.data.enrolledStudents);
      } catch (err) {
        setError("Failed to load students.");
      }
      setLoading(false);
    };

    fetchStudents();
  }, [courseId]);

  const markAttendance = async (studentId) => {
    if (!studentId) {
      setMessage({ type: "error", text: "Please select a student." });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/staff/courses/${courseId}/attendance/${studentId}`,
        { date, status },
        { withCredentials: true }
      );
      setMessage({ type: "success", text: "Attendance marked successfully!" });

      setSelectedStudent("");
      setStatus("present");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to mark attendance." });
    }
  };

  return (
    <PortalPage
      title="Mark Attendance"
      description="Record a student as present or absent for a class date."
      back={{ label: "Dashboard", to: "/staff" }}
      width="narrow"
      actions={
        <Button variant="secondary" to={`/staff/courses/${courseId}/view-attendance`} icon={ClipboardDocumentListIcon}>
          View records
        </Button>
      }
    >
      {loading ? (
        <LoadingState label="Loading students..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <Card className="space-y-5">
          {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

          <Field label="Select Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>

          <Field label="Select Student">
            <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="">-- Choose Student --</option>
              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name} ({student.email})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </Select>
          </Field>

          <FormActions>
            <Button onClick={() => markAttendance(selectedStudent)} disabled={!selectedStudent}>
              Mark Attendance
            </Button>
          </FormActions>
        </Card>
      )}
    </PortalPage>
  );
}

export default StaffAttendance;
